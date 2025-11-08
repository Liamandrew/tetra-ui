import { Text, View } from "react-native";
import { cn } from "../lib/utils";
import { Check } from "./icons";
import { InputPressable } from "./input";

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
  return (
    <View
      {...props}
      className={cn(
        "size-6 shrink-0 items-center justify-center rounded-[4px] border border-input bg-transparent shadow-xs dark:bg-input/30",
        checked && "border-primary bg-primary dark:bg-primary",
        invalid && "border-destructive",
        className
      )}
    >
      {checked && <Check className="size-5 bg-primary-foreground" />}
    </View>
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
      <Text className="text-base">{children}</Text>
    </InputPressable>
  );
};
