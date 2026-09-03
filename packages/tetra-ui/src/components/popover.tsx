import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  type DimensionValue,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Pressable,
  useWindowDimensions,
  type View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import { useRelativePosition } from "@/registry/hooks/use-relative-position";
import { cn, mergeRefs } from "@/registry/lib/utils";
import { Portal, PortalOverlay } from "@/registry/ui/portal";
import { Slot } from "@/registry/ui/slot";

// Constants
const ANIMATION_DURATION = 200;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const SCREEN_MARGIN = 12;
const FIT_MAX_WIDTH = 280;
const OVERLAY_OPACITY = { dark: 0.32, light: 0.12 } as const;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type LayoutPosition = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

type PopoverSide = "top" | "bottom" | "left" | "right";
type PopoverAlign = "start" | "center" | "end";

type PopoverContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibilityProgress: SharedValue<number>;
  triggerPosition?: LayoutPosition;
  setTriggerPosition: (position?: LayoutPosition) => void;
  contentLayout?: LayoutRectangle;
  setContentLayout: (position?: LayoutRectangle) => void;
};

type PopoverProps = Partial<PopoverContextProps> & {
  children: React.ReactNode;
};

type PopoverPortalProps = Partial<React.ComponentProps<typeof Portal>>;

type PopoverOverlayProps = {
  closeOnPress?: boolean;
  className?: string;
};

type PopoverContentProps = React.ComponentProps<typeof View> & {
  avoidCollisions?: boolean;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  width?: "full" | "fit" | "auto" | "trigger" | number | `${number}%`;
};

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof Pressable> & {
  asChild?: boolean;
};

type PopoverCloseProps = React.ComponentPropsWithRef<typeof Pressable> & {
  asChild?: boolean;
};

// Context
const PopoverContext = createContext<PopoverContextProps | null>(null);

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a Popover");
  }
  return context;
};

// Components
export const Popover = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [contentLayout, setContentLayout] = useState<LayoutRectangle>();
  const [triggerPosition, setTriggerPosition] = useState<LayoutPosition>();

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const visibilityProgress = useSharedValue(open ? 1 : 0);

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChangeProp?.(nextOpen);
    },
    [onOpenChangeProp]
  );

  useEffect(() => {
    visibilityProgress.value = withTiming(open ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [open, visibilityProgress]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onOpenChange(false);
        return true;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [open, onOpenChange]);

  const ctx = useMemo(
    () => ({
      contentLayout,
      onOpenChange,
      open,
      setContentLayout,
      setTriggerPosition,
      triggerPosition,
      visibilityProgress,
    }),
    [open, triggerPosition, contentLayout, visibilityProgress, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={ctx}>{children}</PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({
  asChild,
  ref: refProp,
  onPress: onPressProp,
  ...props
}: PopoverTriggerProps) => {
  const { open, onOpenChange, setTriggerPosition } = usePopover();
  const ref = useRef<React.ComponentRef<typeof Pressable>>(null);

  const mergedRefs = mergeRefs(ref, refProp);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      onPressProp?.(e);

      if (open) {
        onOpenChange(false);
        return;
      }

      ref.current?.measure((_x, _y, width, height, pageX, pageY) => {
        setTriggerPosition({
          height,
          pageX,
          pageY,
          width,
        });

        onOpenChange(true);
      });
    },
    [open, onOpenChange, onPressProp, setTriggerPosition]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <Comp
      {...props}
      collapsable={false}
      onPress={handlePress}
      ref={mergedRefs}
    />
  );
};

export const PopoverClose = ({ asChild, ...props }: PopoverCloseProps) => {
  const { onOpenChange } = usePopover();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <Comp
      {...props}
      onPress={() => {
        onOpenChange(false);
      }}
    />
  );
};

export const PopoverPortal = ({
  children,
  name = "popover-portal",
  ...portalProps
}: PopoverPortalProps) => {
  const ctx = usePopover();
  const [mounted, setMounted] = useState(ctx.open);

  useEffect(() => {
    if (ctx.open) {
      setMounted(true);
      return;
    }

    const timeout = setTimeout(() => {
      setMounted(false);
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [ctx.open]);

  if (!mounted) {
    return null;
  }

  return (
    <Portal name={name} {...portalProps}>
      <PopoverContext.Provider value={ctx}>
        <PortalOverlay>{children}</PortalOverlay>
      </PopoverContext.Provider>
    </Portal>
  );
};

export const PopoverOverlay = ({
  closeOnPress = true,
  className,
}: PopoverOverlayProps) => {
  const { onOpenChange, visibilityProgress } = usePopover();
  const { theme } = useUniwind();
  const overlayOpacity =
    theme === "dark" ? OVERLAY_OPACITY.dark : OVERLAY_OPACITY.light;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        visibilityProgress.value,
        [0, 1],
        [0, overlayOpacity],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <AnimatedPressable
      className={cn("absolute inset-0 bg-black", className)}
      disabled={!closeOnPress}
      onPress={() => onOpenChange(false)}
      style={animatedStyle}
    />
  );
};

export const PopoverContent = ({
  children,
  className,
  onLayout: onLayoutProp,
  style,
  width = "fit",
  avoidCollisions = true,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  ...props
}: PopoverContentProps) => {
  const {
    visibilityProgress,
    triggerPosition,
    setContentLayout,
    contentLayout,
  } = usePopover();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();

  const positionInsets = useMemo(
    () => ({
      bottom: insets.bottom + SCREEN_MARGIN,
      left: insets.left + SCREEN_MARGIN,
      right: insets.right + SCREEN_MARGIN,
      top: insets.top + SCREEN_MARGIN,
    }),
    [insets]
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setContentLayout(event.nativeEvent.layout);
      onLayoutProp?.(event);
    },
    [setContentLayout, onLayoutProp]
  );

  const transformOrigin = getContentTransformOrigin(side, align);
  const translateXSign = getTranslateSign(side, "x");
  const translateYSign = getTranslateSign(side, "y");

  const animatedStyle = useAnimatedStyle(() => {
    const progress = visibilityProgress.value;
    const opacity = interpolate(progress, [0, 1], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(progress, [0, 1], [0.92, 1], Extrapolation.CLAMP);
    const offset = interpolate(progress, [0, 1], [6, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { translateX: offset * translateXSign },
        { translateY: offset * translateYSign },
        { scale },
      ],
      transformOrigin,
    };
  });

  const positionStyle = useRelativePosition({
    align,
    alignOffset,
    avoidCollisions,
    contentLayout: contentLayout ?? null,
    insets: positionInsets,
    side,
    sideOffset,
    triggerPosition: triggerPosition ?? null,
  });

  const widthStyle = getContentWidthStyle(
    width,
    triggerPosition?.width,
    Math.min(
      FIT_MAX_WIDTH,
      dimensions.width - positionInsets.left - positionInsets.right
    )
  );

  if (!triggerPosition) {
    return null;
  }

  return (
    <Animated.View
      {...props}
      className={cn(
        "z-50 rounded-xl border border-border bg-popover p-3 shadow-lg",
        className
      )}
      collapsable={false}
      onLayout={onLayout}
      pointerEvents={contentLayout ? "auto" : "none"}
      style={[
        positionStyle,
        widthStyle,
        animatedStyle,
        contentLayout ? null : { opacity: 0 },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Utils
function getContentWidthStyle(
  width: NonNullable<PopoverContentProps["width"]>,
  triggerWidth: number | undefined,
  maxFitWidth: number
): ViewStyle {
  if (width === "full") {
    return { width: "100%" };
  }

  if (width === "trigger") {
    return { width: triggerWidth };
  }

  if (width === "auto") {
    return { width: "auto" };
  }

  if (typeof width === "number") {
    return { width };
  }

  if (width.endsWith("%")) {
    return { width: width as DimensionValue };
  }

  return {
    alignSelf: "flex-start",
    maxWidth: maxFitWidth,
  };
}

function getContentTransformOrigin(side: PopoverSide, align: PopoverAlign) {
  let x = "center";
  if (side === "left") {
    x = "right";
  } else if (side === "right") {
    x = "left";
  } else if (align === "start") {
    x = "left";
  } else if (align === "end") {
    x = "right";
  }

  let y = "center";
  if (side === "top") {
    y = "bottom";
  } else if (side === "bottom") {
    y = "top";
  } else if (align === "start") {
    y = "top";
  } else if (align === "end") {
    y = "bottom";
  }

  return `${x} ${y}`;
}

function getTranslateSign(side: PopoverSide, axis: "x" | "y") {
  if (axis === "x") {
    if (side === "left") {
      return 1;
    }
    if (side === "right") {
      return -1;
    }
    return 0;
  }

  if (side === "top") {
    return 1;
  }
  if (side === "bottom") {
    return -1;
  }
  return 0;
}
