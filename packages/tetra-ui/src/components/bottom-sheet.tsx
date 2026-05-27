import GorhomBottomSheet, {
  type BottomSheetBackgroundProps,
  type BottomSheetProps,
  BottomSheetView,
  BottomSheetFooter as GorhomBottomSheetFooter,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  type BlurEvent,
  type FocusEvent,
  Keyboard,
  type LayoutChangeEvent,
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { cn } from "@/lib/utils";
import { Button, ButtonIcon } from "./button";
import { XIcon } from "./icons";
import { Portal, PortalOverlay } from "./portal";
import { Slot } from "./slot";

// Constants
const BOTTOM_SHEET_PORTAL_NAME = "bottom-sheet-portal";
const BOTTOM_SHEET_KEYBOARD_BEHAVIOR = "extend" as const;
const SHEET_TOP_GAP = 16;
const KEYBOARD_SHOW_EVENT =
  Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const KEYBOARD_HIDE_EVENT =
  Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type SnapPointInput = number | string;

type BottomSheetChildDisplayName =
  | "BottomSheetFooter"
  | "BottomSheetHeader"
  | "BottomSheetScrollView";

type BottomSheetContentConfig = {
  snapPoints?: SnapPointInput[];
  defaultSnapIndex?: number;
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  enableDynamicSizing?: boolean;
  enableContentPanningGesture?: boolean;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  detached?: boolean;
  bottomInset?: number;
};

type BottomSheetContextValue = {
  open: boolean;
  mounted: boolean;
  setMounted: (mounted: boolean) => void;
  onOpenChange: (open: boolean) => void;
  bottomSheetRef: React.RefObject<GorhomBottomSheet | null>;
  animatedIndex: SharedValue<number>;
  contentConfig: BottomSheetContentConfig;
  setContentConfig: (config: BottomSheetContentConfig) => void;
  currentSnapIndex: number;
  setCurrentSnapIndex: (index: number) => void;
  keyboardVisible: boolean;
};

type BottomSheetRootProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

type BottomSheetPortalProps = Partial<React.ComponentProps<typeof Portal>>;

type BottomSheetOverlayProps = {
  closeOnPress?: boolean;
  className?: string;
};

type BottomSheetContentProps = Omit<
  React.ComponentProps<typeof View>,
  "children"
> &
  BottomSheetContentConfig & {
    children: React.ReactNode;
    handleClassName?: string;
    onAnimate?: BottomSheetProps["onAnimate"];
  };

type BottomSheetTriggerProps = PressableProps & {
  asChild?: boolean;
};

type BottomSheetCloseProps = PressableProps & {
  asChild?: boolean;
};

type BottomSheetStickyScrollContentProps = {
  header: React.ReactNode;
  body: React.ReactNode[];
  className?: string;
};

// Utils
const getMaxSnapPercent = (windowHeight: number, topInset: number) => {
  if (windowHeight <= 0) {
    return 100;
  }

  return Math.floor(((windowHeight - topInset) / windowHeight) * 100);
};

const normalizeSnapPoints = (
  snapPoints: SnapPointInput[] | undefined,
  maxSnapPercent: number
): (string | number)[] | undefined => {
  if (!snapPoints?.length) {
    return;
  }

  return snapPoints.map((point) => {
    if (typeof point === "string") {
      if (point.endsWith("%")) {
        const parsed = Number.parseFloat(point);
        if (!Number.isNaN(parsed)) {
          return `${Math.min(Math.round(parsed), maxSnapPercent)}%`;
        }
      }

      return point;
    }

    if (point > 0 && point <= 1) {
      return `${Math.min(Math.round(point * 100), maxSnapPercent)}%`;
    }

    return point;
  });
};

const resolveDefaultSnapIndex = (
  snapPoints: SnapPointInput[] | undefined,
  defaultSnapIndex?: number
) => {
  if (defaultSnapIndex !== undefined) {
    return defaultSnapIndex;
  }

  return snapPoints?.length ? snapPoints.length - 1 : 0;
};

const getBottomSheetChildDisplayName = (child: React.ReactNode) => {
  if (!isValidElement(child)) {
    return;
  }

  return (child.type as { displayName?: string }).displayName;
};

const isBottomSheetChild = (
  child: React.ReactNode,
  displayName: BottomSheetChildDisplayName
) => getBottomSheetChildDisplayName(child) === displayName;

const splitBottomSheetChildren = (children: React.ReactNode) => {
  const body: React.ReactNode[] = [];
  let footer: React.ReactNode = null;
  let header: React.ReactNode = null;
  let hasScrollView = false;

  Children.forEach(children, (child) => {
    const displayName = getBottomSheetChildDisplayName(child);

    if (displayName === "BottomSheetFooter") {
      footer = child;
      return;
    }

    if (displayName === "BottomSheetHeader") {
      header = child;
      return;
    }

    if (displayName === "BottomSheetScrollView") {
      hasScrollView = true;
    }

    body.push(child);
  });

  return { body, footer, header, hasScrollView };
};

const getOverlayOpacityRange = (isDark: boolean) => {
  const maxOpacity = isDark ? 0.75 : 0.5;
  return { maxOpacity, minOpacity: maxOpacity * 0.35 };
};

const BottomSheetStickyScrollContent = ({
  header,
  body,
  className,
}: BottomSheetStickyScrollContentProps) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  return (
    <View className={cn("flex-1 bg-background", className)}>
      {header ? (
        <View
          className="absolute inset-x-0 top-0 z-10 border-border border-b bg-background"
          onLayout={onHeaderLayout}
        >
          {header}
        </View>
      ) : null}
      {body.map((child, index) => {
        if (
          isBottomSheetChild(child, "BottomSheetScrollView") &&
          isValidElement(child)
        ) {
          const scrollChild = child as React.ReactElement<{
            className?: string;
            headerInset?: number;
          }>;

          return cloneElement(scrollChild, {
            className: cn("flex-1", scrollChild.props.className),
            headerInset: headerHeight,
            key: scrollChild.key ?? `bottom-sheet-scroll-${index}`,
          });
        }

        return child;
      })}
    </View>
  );
};

const BottomSheetHandleIndicator = ({ className }: { className?: string }) => (
  <View
    className={cn("mt-2 h-1 w-10 self-center rounded-full bg-muted", className)}
  />
);

const BottomSheetBackground = (props: BottomSheetBackgroundProps) => (
  <View className="rounded-t-2xl bg-background" {...props} />
);

const renderNullBackdrop = () => null;

// Context
const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheet");
  }
  return context;
};

export const useBottomSheet = () => {
  const { open, onOpenChange } = useBottomSheetContext();
  return { open, onOpenChange };
};

export const useBottomSheetAnimation = () => {
  const { animatedIndex } = useBottomSheetContext();
  return { progress: animatedIndex, animatedIndex };
};

export const useBottomSheetInputHandlers = (handlers?: {
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
}) => {
  const {
    bottomSheetRef,
    currentSnapIndex,
    contentConfig,
    setCurrentSnapIndex,
  } = useBottomSheetContext();
  const previousSnapIndexRef = useRef(0);

  const snapPointCount = contentConfig.snapPoints?.length ?? 0;
  const maxSnapIndex = Math.max(0, snapPointCount - 1);
  const { keyboardBehavior } = contentConfig;

  const onFocus = useCallback(() => {
    previousSnapIndexRef.current = currentSnapIndex;

    if (snapPointCount === 0) {
      bottomSheetRef.current?.expand();
      return;
    }

    if (keyboardBehavior === "extend") {
      bottomSheetRef.current?.expand();
      setCurrentSnapIndex(maxSnapIndex);
      return;
    }

    bottomSheetRef.current?.snapToIndex(maxSnapIndex);
    setCurrentSnapIndex(maxSnapIndex);
  }, [
    bottomSheetRef,
    currentSnapIndex,
    keyboardBehavior,
    maxSnapIndex,
    setCurrentSnapIndex,
    snapPointCount,
  ]);

  const onBlur = useCallback(() => {
    if (snapPointCount === 0) {
      return;
    }

    const restoreIndex = previousSnapIndexRef.current;
    bottomSheetRef.current?.snapToIndex(restoreIndex);
    setCurrentSnapIndex(restoreIndex);
  }, [bottomSheetRef, setCurrentSnapIndex, snapPointCount]);

  const onFocusWithEvent = useCallback(
    (event: FocusEvent) => {
      handlers?.onFocus?.(event);
      onFocus();
    },
    [handlers, onFocus]
  );

  const onBlurWithEvent = useCallback(
    (event: BlurEvent) => {
      handlers?.onBlur?.(event);
      onBlur();
    },
    [handlers, onBlur]
  );

  return {
    onFocus,
    onBlur,
    onFocusWithEvent,
    onBlurWithEvent,
  };
};

// Components
export const BottomSheet = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: BottomSheetRootProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [mounted, setMounted] = useState(openProp ?? false);
  const [contentConfig, setContentConfig] = useState<BottomSheetContentConfig>(
    {}
  );
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const animatedIndex = useSharedValue(-1);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChangeProp?.(nextOpen);
    },
    [isControlled, onOpenChangeProp]
  );

  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      return;
    }

    bottomSheetRef.current?.close();
  }, [open]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(KEYBOARD_SHOW_EVENT, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(KEYBOARD_HIDE_EVENT, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const ctx = useMemo(
    (): BottomSheetContextValue => ({
      open,
      mounted,
      setMounted,
      onOpenChange,
      bottomSheetRef,
      animatedIndex,
      contentConfig,
      setContentConfig,
      currentSnapIndex,
      setCurrentSnapIndex,
      keyboardVisible,
    }),
    [
      open,
      mounted,
      onOpenChange,
      animatedIndex,
      contentConfig,
      currentSnapIndex,
      keyboardVisible,
    ]
  );

  return (
    <BottomSheetContext.Provider value={ctx}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const BottomSheetTrigger = ({
  asChild,
  ...props
}: BottomSheetTriggerProps) => {
  const { onOpenChange } = useBottomSheetContext();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={() => onOpenChange(true)} />;
};

export const BottomSheetPortal = ({
  children,
  name = BOTTOM_SHEET_PORTAL_NAME,
  ...portalProps
}: BottomSheetPortalProps) => {
  const ctx = useBottomSheetContext();

  if (!ctx.mounted) {
    return null;
  }

  return (
    <Portal name={name} {...portalProps}>
      <BottomSheetContext.Provider value={ctx}>
        <PortalOverlay>{children}</PortalOverlay>
      </BottomSheetContext.Provider>
    </Portal>
  );
};

export const BottomSheetOverlay = ({
  closeOnPress = true,
  className,
}: BottomSheetOverlayProps) => {
  const {
    onOpenChange,
    animatedIndex,
    contentConfig,
    bottomSheetRef,
    keyboardVisible,
  } = useBottomSheetContext();

  const { maxOpacity, minOpacity } = getOverlayOpacityRange(
    Uniwind.currentTheme === "dark"
  );
  const maxSnapIndex = Math.max(0, (contentConfig.snapPoints?.length ?? 1) - 1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0, maxSnapIndex],
      [0, minOpacity, maxOpacity],
      Extrapolation.CLAMP
    ),
  }));

  const handlePress = useCallback(() => {
    if (keyboardVisible) {
      Keyboard.dismiss();
      return;
    }

    bottomSheetRef.current?.close();
    onOpenChange(false);
  }, [bottomSheetRef, keyboardVisible, onOpenChange]);

  return (
    <AnimatedPressable
      className={cn("bg-black", className)}
      disabled={!closeOnPress}
      onPress={handlePress}
      style={[StyleSheet.absoluteFill, animatedStyle]}
    />
  );
};

export const BottomSheetContent = ({
  children,
  className,
  snapPoints: snapPointsProp,
  defaultSnapIndex: defaultSnapIndexProp,
  enablePanDownToClose = true,
  enableOverDrag = true,
  enableDynamicSizing: enableDynamicSizingProp,
  enableContentPanningGesture = true,
  keyboardBehavior = BOTTOM_SHEET_KEYBOARD_BEHAVIOR,
  detached,
  bottomInset,
  handleClassName,
  onAnimate,
}: BottomSheetContentProps) => {
  const {
    open,
    onOpenChange,
    setMounted,
    bottomSheetRef,
    animatedIndex,
    setContentConfig,
    setCurrentSnapIndex,
  } = useBottomSheetContext();

  const { top, bottom } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const topInset = top + SHEET_TOP_GAP;
  const maxDynamicContentSize = windowHeight - topInset;
  const maxSnapPercent = getMaxSnapPercent(windowHeight, topInset);

  const contentConfig = useMemo(
    (): BottomSheetContentConfig => ({
      snapPoints: snapPointsProp,
      defaultSnapIndex: defaultSnapIndexProp,
      enablePanDownToClose,
      enableOverDrag,
      enableDynamicSizing: enableDynamicSizingProp,
      enableContentPanningGesture,
      keyboardBehavior,
      detached,
      bottomInset,
    }),
    [
      snapPointsProp,
      defaultSnapIndexProp,
      enablePanDownToClose,
      enableOverDrag,
      enableDynamicSizingProp,
      enableContentPanningGesture,
      keyboardBehavior,
      detached,
      bottomInset,
    ]
  );

  useEffect(() => {
    setContentConfig(contentConfig);
  }, [contentConfig, setContentConfig]);

  const normalizedSnapPoints = useMemo(
    () => normalizeSnapPoints(snapPointsProp, maxSnapPercent),
    [snapPointsProp, maxSnapPercent]
  );

  const snapPointCount = normalizedSnapPoints?.length ?? 0;
  const hasSnapPoints = snapPointCount > 0;
  const enableDynamicSizing = enableDynamicSizingProp ?? !hasSnapPoints;

  const defaultSnapIndex = Math.min(
    resolveDefaultSnapIndex(snapPointsProp, defaultSnapIndexProp),
    Math.max(0, snapPointCount - 1)
  );

  const sheetIndex = open ? (enableDynamicSizing ? 0 : defaultSnapIndex) : -1;

  const { body, footer, header, hasScrollView } = useMemo(
    () => splitBottomSheetChildren(children),
    [children]
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      setCurrentSnapIndex(index);

      if (index === -1) {
        onOpenChange(false);
        setMounted(false);
      }
    },
    [onOpenChange, setCurrentSnapIndex, setMounted]
  );

  useEffect(() => {
    if (!(open && enablePanDownToClose)) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        bottomSheetRef.current?.close();
        onOpenChange(false);
        return true;
      }
    );

    return () => subscription.remove();
  }, [open, enablePanDownToClose, onOpenChange, bottomSheetRef]);

  useEffect(() => {
    if (!(open && enableDynamicSizing)) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      bottomSheetRef.current?.expand();
    });

    return () => cancelAnimationFrame(frame);
  }, [open, bottomSheetRef, enableDynamicSizing]);

  const footerComponent = useCallback(
    (footerProps: React.ComponentProps<typeof GorhomBottomSheetFooter>) => (
      <GorhomBottomSheetFooter {...footerProps}>
        {footer}
      </GorhomBottomSheetFooter>
    ),
    [footer]
  );

  const handleComponent = useCallback(
    () => <BottomSheetHandleIndicator className={handleClassName} />,
    [handleClassName]
  );

  const sheetContent = hasScrollView ? (
    <BottomSheetStickyScrollContent
      body={body}
      className={className}
      header={header}
    />
  ) : (
    <BottomSheetView
      className={cn("bg-background", className)}
      enableFooterMarginAdjustment={Boolean(footer)}
      style={{ paddingBottom: footer ? 0 : bottom }}
    >
      {header}
      {body}
    </BottomSheetView>
  );

  return (
    <GorhomBottomSheet
      animatedIndex={animatedIndex}
      backdropComponent={renderNullBackdrop}
      backgroundComponent={BottomSheetBackground}
      bottomInset={bottomInset ?? 0}
      detached={detached}
      enableContentPanningGesture={enableContentPanningGesture}
      enableDynamicSizing={enableDynamicSizing}
      enableOverDrag={enableOverDrag}
      enablePanDownToClose={enablePanDownToClose}
      footerComponent={footer ? footerComponent : undefined}
      handleComponent={handleComponent}
      index={sheetIndex}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior="restore"
      maxDynamicContentSize={maxDynamicContentSize}
      onAnimate={onAnimate}
      onChange={handleSheetChange}
      ref={bottomSheetRef}
      snapPoints={normalizedSnapPoints}
      topInset={topInset}
    >
      {sheetContent}
    </GorhomBottomSheet>
  );
};

export const BottomSheetScrollView = ({
  className,
  contentContainerClassName,
  contentContainerStyle,
  headerInset = 0,
  ...props
}: React.ComponentProps<typeof GorhomBottomSheetScrollView> & {
  contentContainerClassName?: string;
  headerInset?: number;
}) => (
  <GorhomBottomSheetScrollView
    className={className}
    contentContainerClassName={cn("px-4 pb-4", contentContainerClassName)}
    contentContainerStyle={[
      headerInset > 0 ? { paddingTop: headerInset } : undefined,
      contentContainerStyle,
    ]}
    {...props}
  />
);

BottomSheetScrollView.displayName = "BottomSheetScrollView";

export const BottomSheetBody = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View className={cn("px-4", className)} {...props} />
);

export const BottomSheetHeader = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    className={cn(
      "flex flex-row items-center gap-1 bg-background p-4",
      className
    )}
    {...props}
  >
    {children}
    <BottomSheetClose asChild>
      <Button className="ml-auto" size="icon" variant="link">
        <ButtonIcon className="text-foreground">
          <XIcon />
        </ButtonIcon>
      </Button>
    </BottomSheetClose>
  </View>
);

BottomSheetHeader.displayName = "BottomSheetHeader";

export const BottomSheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text
    className={cn(
      "font-semibold text-foreground text-xl leading-none",
      className
    )}
    {...props}
  />
);

export const BottomSheetFooter = ({
  className,
  style,
  ...props
}: React.ComponentProps<typeof View>) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className={cn(
        "flex flex-col gap-2 border-border border-t bg-background px-4 pt-4",
        className
      )}
      style={[{ paddingBottom: Math.max(bottom, 16) }, style]}
      {...props}
    />
  );
};

BottomSheetFooter.displayName = "BottomSheetFooter";

export const BottomSheetClose = ({
  asChild,
  ...props
}: BottomSheetCloseProps) => {
  const { onOpenChange, bottomSheetRef } = useBottomSheetContext();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <Comp
      {...props}
      onPress={() => {
        bottomSheetRef.current?.close();
        onOpenChange(false);
      }}
    />
  );
};
