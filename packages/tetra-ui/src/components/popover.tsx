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
  type DimensionValue,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Pressable,
  StyleSheet,
  type View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";
import { Uniwind } from "uniwind";
import { useRelativePosition } from "@/hooks/use-relative-position";
import { cn, mergeRefs } from "@/lib/utils";
import { Portal } from "./portal";
import * as Slot from "./slot";

// Constants
const ANIMATION_DURATION = 200;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type LayoutPosition = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

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
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  width?: "full" | "fit" | "auto" | "trigger" | number | `${number}%`;
  disablePositioningStyle?: boolean;
};

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof Pressable> & {
  asChild?: boolean;
};

type PopoverCloseProps = React.ComponentPropsWithRef<typeof Pressable> & {
  asChild?: boolean;
};

// Context
const PopoverContext = createContext<PopoverContextProps | null>(null);

const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a Popover");
  }
  return context;
};

// Components
export const Popover = ({
  open: openProp,
  onOpenChange,
  children,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [contentLayout, setContentLayout] = useState<LayoutRectangle>();
  const [triggerPosition, setTriggerPosition] = useState<LayoutPosition>();

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const visibilityProgress = useSharedValue(open ? 1 : 0);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  useEffect(() => {
    visibilityProgress.value = withTiming(open ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [open, visibilityProgress]);

  const ctx = useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      visibilityProgress,
      contentLayout,
      setContentLayout,
      triggerPosition,
      setTriggerPosition,
    }),
    [open, triggerPosition, contentLayout, visibilityProgress, handleOpenChange]
  );

  return (
    <PopoverContext.Provider value={ctx}>{children}</PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({
  asChild,
  onLayout: onLayoutProp,
  ref: refProp,
  ...props
}: PopoverTriggerProps) => {
  const { onOpenChange, setTriggerPosition } = usePopover();
  const ref = useRef<React.ComponentRef<typeof Pressable>>(null);

  const mergedRefs = mergeRefs(ref, refProp);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      props.onPress?.(e);

      ref.current?.measureInWindow((x, y, width, height) => {
        setTriggerPosition({
          pageX: x,
          pageY: y,
          width,
          height,
        });
      });

      onOpenChange(true);
    },
    [onOpenChange, props.onPress, setTriggerPosition]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={handlePress} ref={mergedRefs} />;
};

export const PopoverClose = ({ asChild, ...props }: PopoverCloseProps) => {
  const { onOpenChange, setTriggerPosition } = usePopover();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <Comp
      {...props}
      onPress={() => {
        onOpenChange(false);
        setTriggerPosition(undefined);
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

  if (!ctx.open) {
    return null;
  }

  return (
    <Portal name={name} {...portalProps}>
      <PopoverContext.Provider value={ctx}>
        <FullWindowOverlay>{children}</FullWindowOverlay>
      </PopoverContext.Provider>
    </Portal>
  );
};

export const PopoverOverlay = ({
  closeOnPress = true,
  className,
}: PopoverOverlayProps) => {
  const { onOpenChange, visibilityProgress } = usePopover();

  const isDark = Uniwind.currentTheme === "dark";

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      visibilityProgress.value,
      [0, 1],
      [0, isDark ? 0.75 : 0.5],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <AnimatedPressable
      className={cn("bg-black", className)}
      disabled={!closeOnPress}
      onPress={() => onOpenChange(false)}
      style={[StyleSheet.absoluteFill, animatedStyle]}
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
  align = "start",
  alignOffset = 0,
  ...props
}: PopoverContentProps) => {
  const {
    open,
    visibilityProgress,
    triggerPosition,
    setContentLayout,
    contentLayout,
  } = usePopover();

  const insets = useSafeAreaInsets();

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setContentLayout(event.nativeEvent.layout);
      onLayoutProp?.(event);
    },
    [setContentLayout, onLayoutProp]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      visibilityProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      visibilityProgress.value,
      [0, 1],
      [0.95, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const positionStyle = useRelativePosition({
    align,
    avoidCollisions,
    triggerPosition: triggerPosition ?? null,
    contentLayout: contentLayout ?? null,
    alignOffset,
    insets,
    side,
    sideOffset,
  });

  const widthStyle = useMemo(() => {
    const _widthStyle: ViewStyle = {};
    if (width === "full") {
      _widthStyle.width = "100%";
    }
    if (typeof width === "number" || width === "auto" || width.endsWith("%")) {
      _widthStyle.width = width as DimensionValue;
    }
    if (width === "trigger") {
      _widthStyle.width = triggerPosition?.width as DimensionValue;
    }
    return _widthStyle;
  }, [width, triggerPosition]);

  if (!open) {
    return null;
  }

  if (!triggerPosition) {
    return null;
  }

  return (
    <Animated.View
      {...props}
      className={cn(
        "z-50 rounded-lg border border-border bg-background p-4 shadow-lg",
        className
      )}
      onLayout={onLayout}
      style={[positionStyle, widthStyle, animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
};
