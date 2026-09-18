import { cva } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  BackHandler,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  type PressableStateCallbackType,
  Text,
  useWindowDimensions,
  View,
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
import { createSlots } from "@/registry/lib/slots";
import { cn } from "@/registry/lib/utils";
import {
  Button,
  ButtonIcon,
  type ButtonProps,
  ButtonText,
  buttonIconVariants,
} from "@/registry/ui/button";
import { XIcon } from "@/registry/ui/icons";
import { Scrim, ScrimHost, ScrimTarget } from "@/registry/ui/scrim";

// Constants
const ANIMATION_DURATION = 250;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const EDGE_PADDING = 16;
const MENU_GAP = 12;
const MENU_ITEM_STAGGER = 0.12;
const MENU_ITEM_TRAVEL = 16;
const AUTO_BREAKPOINT = 768;
const TIMING = {
  duration: ANIMATION_DURATION,
  easing: ANIMATION_EASING,
} as const;

const fabSlots = createSlots<"fab">({
  errorMessage: "Fab must be used within a FabHost",
});

// Types
export type FabEdge = "bottom-end" | "bottom-start" | "bottom-center";
export type FabAppearance = "fab" | "extended" | "auto";
export type FabOffset = number | { x?: number; y?: number };

type FabSize = "sm" | "default" | "lg";
type FabVariant = "default" | "secondary";
type FabVisual = "fab" | "extended";

type FabContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setMenu: (menu: React.ReactNode | null) => void;
  size: FabSize;
  variant: FabVariant;
  visual: FabVisual;
  visibilityProgress: SharedValue<number>;
};

type FabLayer = {
  open: boolean;
  edge: FabEdge;
  bottom: number;
  start?: number;
  end?: number;
  fabHeight: number;
  menu: React.ReactNode;
  onDismiss: () => void;
  visibilityProgress: SharedValue<number>;
  fabContext: FabContextValue;
};

type FabHostContextValue = {
  setLayer: (layer: FabLayer | null) => void;
};

export type FabHostProps = React.ComponentProps<typeof View>;

export type FabProps = Omit<ButtonProps, "size" | "variant"> & {
  size?: FabSize;
  variant?: FabVariant;
  appearance?: FabAppearance;
  edge?: FabEdge;
  offset?: FabOffset;
  bottomInset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  positioned?: boolean;
};

export type FabMenuProps = {
  children: React.ReactNode;
};

export type FabMenuItemVariant = "default" | "destructive";

export type FabMenuItemProps = React.ComponentProps<typeof Pressable> & {
  closeOnPress?: boolean;
  variant?: FabMenuItemVariant;
  children: React.ReactNode;
};

type ButtonChildProps = {
  children: React.ReactNode;
  className?: string;
};

// Context
const FabContext = createContext<FabContextValue | null>(null);
const FabHostContext = createContext<FabHostContextValue | null>(null);
const FabMenuItemContext = createContext<FabMenuItemVariant | null>(null);

const useFab = () => {
  const context = useContext(FabContext);
  if (!context) {
    throw new Error("Fab components must be used within a Fab");
  }
  return context;
};

const useOptionalFabHost = () => {
  return useContext(FabHostContext);
};

const useFabMenuItem = () => {
  const context = useContext(FabMenuItemContext);
  if (!context) {
    throw new Error("FabMenuItem parts must be used within a FabMenuItem");
  }
  return context;
};

// Helpers
const normalizeOffset = (offset?: FabOffset) => {
  if (typeof offset === "number") {
    return { x: offset, y: offset };
  }

  return { x: offset?.x ?? 0, y: offset?.y ?? 0 };
};

const getFabPositionStyle = ({
  edge,
  bottom,
  horizontal,
}: {
  edge: FabEdge;
  bottom: number;
  horizontal: number;
}): ViewStyle => {
  if (edge === "bottom-start") {
    return {
      bottom,
      position: "absolute",
      start: horizontal,
      zIndex: 50,
    };
  }

  if (edge === "bottom-center") {
    return {
      alignSelf: "center",
      bottom,
      position: "absolute",
      zIndex: 50,
    };
  }

  return {
    bottom,
    end: horizontal,
    position: "absolute",
    zIndex: 50,
  };
};

const getMenuPositionStyle = ({
  edge,
  bottom,
  fabHeight,
  start,
  end,
}: {
  edge: FabEdge;
  bottom: number;
  fabHeight: number;
  start?: number;
  end?: number;
}): ViewStyle => {
  const style: ViewStyle = {
    bottom: bottom + fabHeight + MENU_GAP,
    flexDirection: "column-reverse",
    gap: 8,
    position: "absolute",
    zIndex: 50,
  };

  if (edge === "bottom-center") {
    style.alignSelf = "center";
    style.alignItems = "center";
    return style;
  }

  if (edge === "bottom-start") {
    style.start = start;
    style.alignItems = "flex-start";
    return style;
  }

  style.end = end;
  style.alignItems = "flex-end";
  return style;
};

const resolveVisual = ({
  appearance,
  width,
}: {
  appearance: FabAppearance;
  width: number;
}): FabVisual => {
  if (appearance === "extended") {
    return "extended";
  }

  if (appearance === "auto" && width >= AUTO_BREAKPOINT) {
    return "extended";
  }

  return "fab";
};

const getButtonSize = (
  size: FabSize,
  visual: FabVisual
): NonNullable<ButtonProps["size"]> => {
  if (visual === "extended") {
    return size;
  }

  if (size === "sm") {
    return "icon-sm";
  }

  return "icon-lg";
};

// Components
export const FabHost = ({ className, children, ...props }: FabHostProps) => {
  const [layer, setLayer] = useState<FabLayer | null>(null);
  const ctx = useMemo(() => ({ setLayer }), []);

  return (
    <FabHostContext.Provider value={ctx}>
      <fabSlots.Provider>
        <ScrimHost className={className} {...props}>
          <ScrimTarget>{children}</ScrimTarget>
          <Scrim
            onPress={layer?.onDismiss}
            open={layer?.open ?? false}
            visibilityProgress={layer?.visibilityProgress}
          />
          <fabSlots.Outlet name="fab" />
          <FabMenuLayer layer={layer} />
        </ScrimHost>
      </fabSlots.Provider>
    </FabHostContext.Provider>
  );
};

const FabMenuItemFrame = ({
  index,
  visibilityProgress,
  children,
}: {
  index: number;
  visibilityProgress: SharedValue<number>;
  children: React.ReactNode;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const start = index * MENU_ITEM_STAGGER;
    const end = Math.min(1, start + 0.55);
    const itemProgress = interpolate(
      visibilityProgress.value,
      [start, end],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity: itemProgress,
      transform: [
        {
          translateY: interpolate(itemProgress, [0, 1], [MENU_ITEM_TRAVEL, 0]),
        },
      ],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const FabMenuLayer = ({ layer }: { layer: FabLayer | null }) => {
  const [mounted, setMounted] = useState(false);
  const open = layer?.open ?? false;

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    const timeout = setTimeout(() => {
      setMounted(false);
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  if (!(layer && mounted)) {
    return null;
  }

  const items = Children.toArray(layer.menu);

  return (
    <FabContext.Provider value={layer.fabContext}>
      <View
        pointerEvents={open ? "box-none" : "none"}
        style={getMenuPositionStyle({
          bottom: layer.bottom,
          edge: layer.edge,
          end: layer.end,
          fabHeight: layer.fabHeight,
          start: layer.start,
        })}
      >
        {items.map((item, index) => {
          if (!isValidElement(item)) {
            return item;
          }

          return (
            <FabMenuItemFrame
              index={index}
              key={item.key}
              visibilityProgress={layer.visibilityProgress}
            >
              {item}
            </FabMenuItemFrame>
          );
        })}
      </View>
    </FabContext.Provider>
  );
};

export const Fab = ({
  className,
  size = "default",
  variant = "default",
  appearance = "fab",
  edge = "bottom-end",
  offset,
  bottomInset = 0,
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  positioned = true,
  children,
  onPress: onPressProp,
  onLayout: onLayoutProp,
  accessibilityLabel,
  busy,
  disabled,
  style,
  ...props
}: FabProps) => {
  const host = useOptionalFabHost();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [menu, setMenu] = useState<React.ReactNode | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [fabHeight, setFabHeight] = useState(56);
  const visibilityProgress = useSharedValue((openProp ?? defaultOpen) ? 1 : 0);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const hasMenu = menu !== null;
  const isPositioned = Boolean(host) && positioned;
  const extra = normalizeOffset(offset);
  const bottom = insets.bottom + EDGE_PADDING + bottomInset + extra.y;
  const horizontal =
    (edge === "bottom-start" ? insets.left : insets.right) +
    EDGE_PADDING +
    extra.x;

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChangeProp?.(nextOpen);
    },
    [isControlled, onOpenChangeProp]
  );

  const visual = resolveVisual({
    appearance,
    width,
  });

  const buttonSize = getButtonSize(size, visual);

  const fabContext = useMemo(
    () => ({
      onOpenChange,
      open,
      setMenu,
      size,
      variant,
      visibilityProgress,
      visual,
    }),
    [onOpenChange, open, size, variant, visibilityProgress, visual]
  );

  useEffect(() => {
    visibilityProgress.value = withTiming(open ? 1 : 0, TIMING);
  }, [open, visibilityProgress]);

  useEffect(() => {
    if (!(open && hasMenu)) {
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
  }, [hasMenu, onOpenChange, open]);

  useLayoutEffect(() => {
    if (!host) {
      return;
    }

    if (!(positioned && menu !== null)) {
      host.setLayer(null);
      return;
    }

    host.setLayer({
      bottom,
      edge,
      end: edge === "bottom-end" ? horizontal : undefined,
      fabContext,
      fabHeight,
      menu,
      onDismiss: () => {
        onOpenChange(false);
      },
      open,
      start: edge === "bottom-start" ? horizontal : undefined,
      visibilityProgress,
    });
  }, [
    bottom,
    edge,
    fabContext,
    fabHeight,
    horizontal,
    host,
    menu,
    onOpenChange,
    open,
    positioned,
    visibilityProgress,
  ]);

  useEffect(() => {
    return () => {
      host?.setLayer(null);
    };
  }, [host]);

  const handlePress = (event: GestureResponderEvent) => {
    onPressProp?.(event);

    if (hasMenu && !(disabled || busy)) {
      onOpenChange(!open);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setFabHeight(event.nativeEvent.layout.height);
    onLayoutProp?.(event);
  };

  const positionStyle = isPositioned
    ? getFabPositionStyle({ bottom, edge, horizontal })
    : undefined;

  const composedStyle =
    typeof style === "function"
      ? (state: PressableStateCallbackType) => [positionStyle, style(state)]
      : [positionStyle, style];

  const node = (
    <FabContext.Provider value={fabContext}>
      <Button
        accessibilityLabel={open ? "Close" : accessibilityLabel}
        accessibilityState={hasMenu ? { expanded: open } : undefined}
        busy={busy}
        className={cn(fabVariants({ appearance: visual, size }), className)}
        collapsable={false}
        disabled={disabled}
        onLayout={handleLayout}
        onPress={handlePress}
        size={buttonSize}
        style={composedStyle}
        variant={variant}
        {...props}
      >
        {children}
      </Button>
    </FabContext.Provider>
  );

  if (isPositioned) {
    return <fabSlots.Fill name="fab">{node}</fabSlots.Fill>;
  }

  return node;
};

Fab.displayName = "Fab";

export const FabText = (props: ButtonChildProps) => {
  const { visual } = useFab();

  if (visual !== "extended") {
    return null;
  }

  return <ButtonText {...props} />;
};

export const FabIcon = ({ children, className }: ButtonChildProps) => {
  const { variant, visual, visibilityProgress, size } = useFab();
  const buttonSize = getButtonSize(size, visual);

  const restingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      visibilityProgress.value,
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        rotate: `${interpolate(visibilityProgress.value, [0, 1], [0, 90], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const closeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      visibilityProgress.value,
      [0.5, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        rotate: `${interpolate(visibilityProgress.value, [0, 1], [-90, 0], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  return (
    <View>
      <Animated.View style={restingStyle}>
        <ButtonIcon className={className}>{children}</ButtonIcon>
      </Animated.View>
      <Animated.View
        className="absolute inset-0 items-center justify-center"
        style={closeStyle}
      >
        <XIcon className={buttonIconVariants({ size: buttonSize, variant })} />
      </Animated.View>
    </View>
  );
};

export const FabMenu = ({ children }: FabMenuProps) => {
  const { setMenu } = useFab();

  useLayoutEffect(() => {
    setMenu(children);
    return () => {
      setMenu(null);
    };
  }, [children, setMenu]);

  return null;
};

export const FabMenuItem = ({
  className,
  closeOnPress = true,
  onPress,
  variant = "default",
  disabled,
  children,
  accessibilityRole = "button",
  ...props
}: FabMenuItemProps) => {
  const { onOpenChange } = useFab();

  return (
    <FabMenuItemContext.Provider value={variant}>
      <Pressable
        accessibilityRole={accessibilityRole}
        className={cn(fabMenuItemVariants({ variant }), className)}
        disabled={disabled}
        {...props}
        onPress={(event) => {
          onPress?.(event);
          if (closeOnPress) {
            onOpenChange(false);
          }
        }}
      >
        {children}
      </Pressable>
    </FabMenuItemContext.Provider>
  );
};

export const FabMenuItemLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  const variant = useFabMenuItem();

  return (
    <Text
      className={cn(fabMenuItemLabelVariants({ variant }), className)}
      {...props}
    />
  );
};

export const FabMenuItemIcon = ({ children, className }: ButtonChildProps) => {
  const variant = useFabMenuItem();
  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "FabMenuItemIcon expects a single React element as children"
      );
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<ButtonChildProps>, {
    className: cn(
      fabMenuItemIconVariants({ variant }),
      className,
      (child as React.ReactElement<ButtonChildProps>).props.className
    ),
  });
};

// Styles
const fabVariants = cva("w-fit rounded-2xl shadow-lg", {
  compoundVariants: [
    {
      appearance: "fab",
      class: "size-10",
      size: "sm",
    },
    {
      appearance: "extended",
      class: "h-10 px-4",
      size: "sm",
    },
    {
      appearance: "extended",
      class: "h-14 px-5",
      size: "default",
    },
    {
      appearance: "fab",
      class: "size-14",
      size: "default",
    },
    {
      appearance: "extended",
      class: "h-16 px-6",
      size: "lg",
    },
    {
      appearance: "fab",
      class: "size-16",
      size: "lg",
    },
  ],
  defaultVariants: {
    appearance: "fab",
    size: "default",
  },
  variants: {
    appearance: {
      extended: "",
      fab: "",
    },
    size: {
      default: "",
      lg: "",
      sm: "",
    },
  },
});

const fabMenuItemVariants = cva(
  "w-fit flex-row items-center gap-2 rounded-xl px-4 py-3 shadow-md disabled:opacity-50",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-card active:bg-muted",
        destructive: "bg-destructive active:opacity-90",
      },
    },
  }
);

const fabMenuItemLabelVariants = cva("font-medium text-base", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "text-card-foreground",
      destructive: "text-white",
    },
  },
});

const fabMenuItemIconVariants = cva("size-5", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "text-card-foreground",
      destructive: "text-white",
    },
  },
});
