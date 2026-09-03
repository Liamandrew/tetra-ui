import { cn } from "@/lib/utils";
import {
  Input,
  type InputAddonChildren,
  InputPressable,
  type InputProps,
  useInputAddons,
  useInputFocusState,
} from "./input";

// Types
export type TextInputProps = InputProps & {
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  children?: InputAddonChildren;
};

// Components
export const TextInput = ({
  onFocus,
  onBlur,
  disabled,
  invalid,
  children,
  ...props
}: TextInputProps) => {
  const { isFocused, internalRef, handleFocus, handleBlur, handlePress } =
    useInputFocusState({ onBlur, onFocus });

  const { startAddons, endAddons, pressableClassName } =
    useInputAddons(children);

  return (
    <InputPressable
      className={cn("h-12 android:py-0", pressableClassName)}
      disabled={disabled}
      focused={isFocused}
      invalid={invalid}
      onPress={handlePress}
    >
      {startAddons}

      <Input
        {...props}
        className={cn("h-12 shrink", props.className)}
        disabled={disabled}
        lineBreakModeIOS="tail"
        multiline={false}
        numberOfLines={1}
        onBlur={handleBlur}
        onFocus={handleFocus}
        pointerEvents={isFocused ? undefined : "none"}
        ref={internalRef}
      />

      {endAddons}
    </InputPressable>
  );
};
