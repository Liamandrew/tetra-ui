import {
  Input,
  InputPressable,
  type InputProps,
  useInputFocusState,
} from "./input";

// Types
export type TextInputProps = InputProps & {
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
};

// Components
export const TextInput = ({
  onFocus,
  onBlur,
  disabled,
  invalid,
  ...props
}: TextInputProps) => {
  const { isFocused, internalRef, handleFocus, handleBlur, handlePress } =
    useInputFocusState({ onFocus, onBlur });

  return (
    <InputPressable
      disabled={disabled}
      focused={isFocused}
      invalid={invalid}
      onPress={handlePress}
    >
      <Input
        {...props}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={internalRef}
      />
    </InputPressable>
  );
};
