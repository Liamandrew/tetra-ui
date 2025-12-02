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
    useInputFocusState({ onFocus, onBlur });

  const { startAddons, endAddons, pressableClassName } =
    useInputAddons(children);

  return (
    <InputPressable
      className={pressableClassName}
      disabled={disabled}
      focused={isFocused}
      invalid={invalid}
      onPress={handlePress}
    >
      {startAddons}

      <Input
        {...props}
        className={cn("shrink", props.className)}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={internalRef}
      />

      {endAddons}
    </InputPressable>
  );
};
