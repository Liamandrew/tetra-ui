import { useCallback, useEffect, useState } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Uniwind, useCSSVariable } from "uniwind";
import { cn } from "@/lib/utils";

// Constants
const ANIMATION_DURATION = 120;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type SwitchProps = React.ComponentProps<typeof Pressable> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  value?: string;
};

// Components
const Thumb = ({
  className,
  ...props
}: React.ComponentProps<typeof Animated.View>) => {
  return (
    <Animated.View
      {...props}
      className={cn("size-5 rounded-full shadow-md", className)}
    />
  );
};

export const Switch = ({
  checked: checkedProp,
  onCheckedChange,
  disabled,
  className,
  value,
  ...props
}: SwitchProps) => {
  const [
    foregroundColor,
    backgroundColor,
    inputColor,
    primaryColor,
    primaryForegroundColor,
  ] = useCSSVariable([
    "--color-foreground",
    "--color-background",
    "--color-input",
    "--color-primary",
    "--color-primary-foreground",
  ]) as [string, string, string, string, string];

  const isDark = Uniwind.currentTheme === "dark";

  const [internalChecked, setInternalChecked] = useState(checkedProp ?? false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const handleCheckedChange = useCallback(
    (nextChecked: boolean) => {
      setInternalChecked(nextChecked);
      onCheckedChange?.(nextChecked);
    },
    [onCheckedChange]
  );

  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const checkedSharedValue = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    checkedSharedValue.value = withTiming(checked ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [checked, checkedSharedValue]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      checkedSharedValue.value,
      [0, 1],
      [inputColor, isDark ? foregroundColor : primaryColor]
    );
    const colorValue = withTiming(color, { duration: ANIMATION_DURATION });

    return {
      backgroundColor: colorValue,
      borderColor: colorValue,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      checkedSharedValue.value,
      [0, 1],
      [
        isDark ? foregroundColor : backgroundColor,
        isDark ? primaryForegroundColor : backgroundColor,
      ]
    );
    const colorValue = withTiming(color, { duration: ANIMATION_DURATION });
    const moveValue = interpolate(
      Number(checkedSharedValue.value),
      [0, 1],
      [0, width.value - height.value]
    );
    const translateValue = withSpring(moveValue, {
      damping: 120,
      mass: 2,
      stiffness: 1200,
    });

    return {
      transform: [{ translateX: translateValue }],
      backgroundColor: colorValue,
    };
  });

  return (
    <AnimatedPressable
      {...props}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      className={cn(
        "flex h-6 w-12 flex-row items-center rounded-full border-2 disabled:opacity-50",
        className
      )}
      disabled={disabled}
      onLayout={(e) => {
        height.value = e.nativeEvent.layout.height;
        width.value = e.nativeEvent.layout.width;
      }}
      onPress={() => handleCheckedChange(!checked)}
      role="switch"
      style={[trackAnimatedStyle]}
    >
      <Thumb style={thumbAnimatedStyle} />
    </AnimatedPressable>
  );
};
