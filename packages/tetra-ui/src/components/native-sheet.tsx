import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type LayoutChangeEvent,
  type LayoutRectangle,
  Modal,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
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
import { scheduleOnRN } from "react-native-worklets";
import { Uniwind } from "uniwind";
import { cn } from "@/lib/utils";
import { Button, ButtonIcon } from "./button";
import { X } from "./icons";
import * as Slot from "./slot";

// Constants
const ANIMATION_DURATION = 200;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type NativeSheetContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  visibilityProgress: SharedValue<number>;
  contentLayout?: LayoutRectangle;
  setContentLayout: (layout?: LayoutRectangle) => void;
};

type NativeSheetProps = Partial<NativeSheetContextProps> & {
  children: React.ReactNode;
};

type NativeSheetModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "onRequestClose" | "transparent" | "visible"
>;

type NativeSheetOverlayProps = {
  closeOnPress?: boolean;
  className?: string;
};

type NativeSheetContentProps = React.ComponentProps<typeof View>;

type NativeSheetTriggerProps = PressableProps & {
  asChild?: boolean;
};

type NativeSheetCloseProps = PressableProps & {
  asChild?: boolean;
};

// Context
const NativeSheetContext = createContext<NativeSheetContextProps | null>(null);

const useNativeSheet = () => {
  const context = useContext(NativeSheetContext);
  if (!context) {
    throw new Error("useNativeSheet must be used within a NativeSheet");
  }
  return context;
};

// Components
export const NativeSheet = ({
  open: openProp,
  onOpenChange,
  children,
}: NativeSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [contentLayout, setContentLayout] = useState<LayoutRectangle>();

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const [visible, setVisible] = useState(open);

  const visibilityProgress = useSharedValue(open ? 1 : 0);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (open) {
      setVisible(true);

      // When opening, set visibility to 0 first (off-screen position)
      // The animation will start after layout is measured in onLayout
      visibilityProgress.value = visibilityProgress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
      });
    } else {
      // When closing, animate immediately (we already have the height)
      visibilityProgress.value = withTiming(
        0,
        {
          duration: ANIMATION_DURATION,
        },
        () => {
          scheduleOnRN(setVisible, false);
        }
      );
    }
  }, [open, visibilityProgress]);

  const ctx = useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      visibilityProgress,
      visible,
      setVisible,
      contentLayout,
      setContentLayout,
    }),
    [open, contentLayout, visibilityProgress, visible, handleOpenChange]
  );

  return (
    <NativeSheetContext.Provider value={ctx}>
      {children}
    </NativeSheetContext.Provider>
  );
};

export const NativeSheetModal = ({
  supportedOrientations = ["portrait", "landscape"],
  ...props
}: NativeSheetModalProps & { children: React.ReactNode }) => {
  const { onOpenChange, visible } = useNativeSheet();

  if (!visible) {
    return null;
  }

  return (
    <Modal
      {...props}
      onRequestClose={() => onOpenChange(false)}
      supportedOrientations={supportedOrientations}
      transparent
      visible={visible}
    />
  );
};

export const NativeSheetOverlay = ({
  closeOnPress = true,
  className,
}: NativeSheetOverlayProps) => {
  const { onOpenChange, visibilityProgress } = useNativeSheet();

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

export const NativeSheetContent = ({
  children,
  ...props
}: NativeSheetContentProps) => {
  const { visibilityProgress, contentLayout, setContentLayout } =
    useNativeSheet();

  const { bottom } = useSafeAreaInsets();

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setContentLayout(event.nativeEvent.layout);
    },
    [setContentLayout]
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (!contentLayout) {
      return {
        transform: [{ translateY: 0 }],
      };
    }

    const translateY = interpolate(
      visibilityProgress.value,
      [0, 1],
      [contentLayout.height, 0]
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      {...props}
      className={cn(
        "absolute inset-0 top-auto ios:rounded-t-xl bg-background",
        props.className
      )}
      onLayout={onLayout}
      style={[{ paddingBottom: bottom }, animatedStyle, props.style]}
    >
      {children}
    </Animated.View>
  );
};

export const NativeSheetBody = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return <View className={cn("px-4", className)} {...props} />;
};

export const NativeSheetHeader = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("flex flex-row items-center gap-1 p-4", className)}
      {...props}
    >
      {children}
      <NativeSheetClose asChild>
        <Button className="ml-auto" size="icon" variant="link">
          <ButtonIcon>
            <X />
          </ButtonIcon>
        </Button>
      </NativeSheetClose>
    </View>
  );
};

export const NativeSheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  return (
    <Text
      className={cn(
        "font-semibold text-foreground text-xl leading-none",
        className
      )}
      {...props}
    />
  );
};

export const NativeSheetFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
};

export const NativeSheetClose = ({
  asChild,
  ...props
}: NativeSheetCloseProps) => {
  const { onOpenChange } = useNativeSheet();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={() => onOpenChange(false)} />;
};

export const NativeSheetTrigger = ({
  asChild,
  ...props
}: NativeSheetTriggerProps) => {
  const { onOpenChange } = useNativeSheet();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={() => onOpenChange(true)} />;
};
