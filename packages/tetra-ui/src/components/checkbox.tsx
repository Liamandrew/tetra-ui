import { useEffect } from "react";
import { Text, type View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { cn } from "../lib/utils";
import { Check } from "./icons";
import { InputPressable } from "./input";

// Constants
const ANIMATION_DURATION = 180;

// Types
export type CheckboxProps = Omit<
  React.ComponentProps<typeof View>,
  "children"
> & {
  checked?: boolean;
  invalid?: boolean;
};

export type CheckboxInputProps = Omit<
  React.ComponentProps<typeof InputPressable>,
  "children"
> & {
  checked?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
};

// Components
export const Checkbox = ({
  className,
  checked,
  invalid,
  ...props
}: CheckboxProps) => {
  const primaryColor = useCSSVariable("--color-primary") as string;

  const checkedSharedValue = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    checkedSharedValue.value = withTiming(checked ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [checked, checkedSharedValue]);

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

  return (
    <Animated.View
      {...props}
      accessibilityState={{ checked }}
      className={cn(
        "size-6 shrink-0 items-center justify-center rounded-lg border border-input shadow-xs dark:bg-input/30",
        checked && "border-primary",
        invalid && "border-destructive",
        className
      )}
      style={animatedStyle}
    >
      {checked && <Check className="size-4 stroke-primary-foreground" />}
    </Animated.View>
  );
};

export const CheckboxInput = ({
  className,
  checked,
  invalid,
  children,
  ...props
}: CheckboxInputProps) => {
  return (
    <InputPressable {...props} className={cn(className)} invalid={invalid}>
      <Checkbox checked={checked} invalid={invalid} />
      <Text className="text-base text-foreground">{children}</Text>
    </InputPressable>
  );
};
