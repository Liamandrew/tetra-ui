import { useEffect } from "react";
import type { View as ViewType } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { cn } from "../lib/utils";

// Constants
const ANIMATION_DURATION = 180;
const DOT_APPEAR_DURATION = 120;
const DOT_CONTRACT_DURATION = 100;
const DOT_CONTRACT_SCALE = 0.75;

// Types
export type RadioProps = Omit<
  React.ComponentProps<typeof ViewType>,
  "children"
> & {
  checked?: boolean;
  invalid?: boolean;
};

// Components
export const Radio = ({
  className,
  checked,
  invalid,
  ...props
}: RadioProps) => {
  const [primaryColor, primaryForegroundColor] = useCSSVariable([
    "--color-primary",
    "--color-primary-foreground",
  ]) as [string, string];

  const checkedSharedValue = useSharedValue(checked ? 1 : 0);
  const dotScale = useSharedValue(checked ? DOT_CONTRACT_SCALE : 0);

  useEffect(() => {
    if (checked) {
      checkedSharedValue.value = withTiming(1, {
        duration: ANIMATION_DURATION,
      });
      dotScale.value = withSequence(
        withTiming(1, { duration: DOT_APPEAR_DURATION }),
        withTiming(DOT_CONTRACT_SCALE, { duration: DOT_CONTRACT_DURATION })
      );
      return;
    }

    checkedSharedValue.value = 0;
    dotScale.value = 0;
  }, [checked, checkedSharedValue, dotScale]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checkedSharedValue.value,
      [0, 1],
      ["transparent", primaryColor]
    );

    return {
      backgroundColor,
    };
  });

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value > 0 ? 1 : 0,
  }));

  return (
    <Animated.View
      {...props}
      accessibilityState={{ checked }}
      className={cn(
        "size-6 shrink-0 items-center justify-center rounded-full border border-input shadow-xs dark:bg-input/30",
        checked && "border-primary",
        invalid && "border-destructive",
        className
      )}
      style={animatedStyle}
    >
      <Animated.View
        className="size-2.5 rounded-full"
        style={[{ backgroundColor: primaryForegroundColor }, dotAnimatedStyle]}
      />
    </Animated.View>
  );
};
