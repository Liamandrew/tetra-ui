import { useMemo } from "react";
import { cn, mergeRefs } from "@/registry/lib/utils";
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
  ref,
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

  const mergedRef = useMemo(
    () => mergeRefs(internalRef, ref),
    [internalRef, ref]
  );

  return (
    <InputGroup
      accessible={false}
      className={cn("android:py-0 h-12", groupClassName)}
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
        ref={mergedRef}
      />

      {endAddons}
    </InputGroup>
  );
};
