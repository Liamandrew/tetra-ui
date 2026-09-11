import { cn } from "@/registry/lib/utils";
import {
  Input,
  type InputAddonChildren,
  InputGroup,
  type InputProps,
  useInputAddons,
  useInputFocusState,
} from "@/registry/ui/input";

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

  const { startAddons, endAddons, groupClassName } = useInputAddons(children);

  return (
    <InputGroup
      accessible={false}
      className={cn("h-12 android:py-0", groupClassName)}
      disabled={disabled}
      focused={isFocused}
      inputFocused={isFocused}
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
        ref={internalRef}
      />

      {endAddons}
    </InputGroup>
  );
};
