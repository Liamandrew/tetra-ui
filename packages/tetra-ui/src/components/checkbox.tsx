import { useEffect } from "react";
import { Text, type View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { cn } from "@/registry/lib/utils";
import { CheckIcon } from "@/registry/ui/icons";
import { InputGroup, type InputGroupProps } from "@/registry/ui/input";

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

export type CheckboxInputProps = Omit<InputGroupProps, "children"> & {
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
        "border-input dark:bg-input/30 size-6 shrink-0 items-center justify-center rounded-lg border shadow-xs",
        checked && "border-primary",
        invalid && "border-destructive",
        className
      )}
      style={animatedStyle}
    >
      {checked ? (
        <CheckIcon className="text-primary-foreground size-4" />
      ) : null}
    </Animated.View>
  );
};

export const CheckboxInput = ({
  className,
  checked,
  invalid,
  children,
  disabled,
  focused,
  ...props
}: CheckboxInputProps) => {
  return (
    <InputGroup
      {...props}
      className={className}
      disabled={disabled}
      focused={focused}
      invalid={invalid}
    >
      <Checkbox checked={checked} invalid={invalid} />
      <Text className="text-foreground text-base">{children}</Text>
    </InputGroup>
  );
};
