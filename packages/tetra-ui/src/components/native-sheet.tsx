import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type LayoutChangeEvent,
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
import { Button, ButtonIcon, type ButtonProps } from "./button";
import { X } from "./icons";

// Constants
const ANIMATION_DURATION = 200;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type NativeSheetContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type NativeSheetOverlayProps = {
  closeOnOverlayPress?: boolean;
  sharedValue: SharedValue<number>;
};

type NativeSheetProps = Partial<NativeSheetContextProps> & {
  children: React.ReactNode;
};

type NativeSheetContentProps = React.ComponentProps<typeof View> & {
  closeOnOverlayPress?: boolean;
};

type NativeSheetTriggerProps = PressableProps & {
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

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  const ctx = useMemo(
    () => ({ open, onOpenChange: handleOpenChange }),
    [open, handleOpenChange]
  );

  return (
    <NativeSheetContext.Provider value={ctx}>
      {children}
    </NativeSheetContext.Provider>
  );
};

const NativeSheetOverlay = ({
  sharedValue,
  closeOnOverlayPress = true,
}: NativeSheetOverlayProps) => {
  const { onOpenChange } = useNativeSheet();

  const isDark = Uniwind.currentTheme === "dark";

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      sharedValue.value,
      [0, 1],
      [0, isDark ? 0.95 : 0.5],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <AnimatedPressable
      className="bg-black"
      disabled={!closeOnOverlayPress}
      onPress={() => onOpenChange(false)}
      style={[StyleSheet.absoluteFill, animatedStyle]}
    />
  );
};

export const NativeSheetContent = ({
  children,
  closeOnOverlayPress = true,
  ...props
}: NativeSheetContentProps) => {
  const { open, onOpenChange } = useNativeSheet();

  const [isVisible, setIsVisible] = useState(open);

  const { bottom } = useSafeAreaInsets();

  const visibility = useSharedValue(open ? 1 : 0);
  const sheetHeight = useSharedValue(0);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      // When opening, set visibility to 0 first (off-screen position)
      // The animation will start after layout is measured in onSheetLayout
      visibility.value = 0;
    } else {
      // When closing, animate immediately (we already have the height)
      visibility.value = withTiming(
        0,
        {
          duration: ANIMATION_DURATION,
        },
        () => {
          scheduleOnRN(setIsVisible, false);
        }
      );
    }
  }, [open, visibility]);

  const onSheetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      if (height > 0) {
        sheetHeight.value = height;
        // Start animation after we have a valid height measurement
        if (open) {
          visibility.value = withTiming(1, {
            duration: ANIMATION_DURATION,
          });
        }
      }
    },
    [open, sheetHeight, visibility]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      visibility.value,
      [0, 1],
      [sheetHeight.value, 0]
    );

    return {
      transform: [{ translateY }],
    };
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      onRequestClose={() => onOpenChange(false)}
      supportedOrientations={["portrait", "landscape"]}
      transparent
      visible={isVisible}
    >
      <NativeSheetOverlay
        closeOnOverlayPress={closeOnOverlayPress}
        sharedValue={visibility}
      />
      <Animated.View
        {...props}
        className={cn(
          "absolute inset-0 top-auto ios:rounded-t-xl bg-background",
          props.className
        )}
        onLayout={onSheetLayout}
        style={[{ paddingBottom: bottom }, animatedStyle, props.style]}
      >
        {children}
      </Animated.View>
    </Modal>
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
      <NativeSheetClose>
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
  children,
  ...props
}: React.PropsWithChildren) => {
  const { onOpenChange } = useNativeSheet();

  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "NativeSheetClose expects a single React element as children"
      );
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<ButtonProps>, {
    ...props,
    onPress: () => onOpenChange(false),
  });
};

export const NativeSheetTrigger = ({
  children,
  asChild,
  ...props
}: NativeSheetTriggerProps) => {
  const { onOpenChange } = useNativeSheet();

  if (asChild) {
    const child = Children.only(children);

    if (!child) {
      if (__DEV__) {
        throw new Error(
          "NativeSheetTrigger expects a single React element as children"
        );
      }
      return null;
    }

    return cloneElement(child as React.ReactElement<PressableProps>, {
      ...props,
      onPress: (e) => {
        props.onPress?.(e);
        onOpenChange(true);
      },
    });
  }

  return (
    <Pressable {...props} onPress={() => onOpenChange(true)}>
      {children}
    </Pressable>
  );
};
