import { forwardRef, useCallback, useRef, useState } from "react";
import {
  type NativeSyntheticEvent,
  Pressable,
  TextInput as RNTextInput,
  type TextInputFocusEventData,
} from "react-native";
import { cn } from "../lib/utils";

// Types
export type InputProps = Omit<
  React.ComponentProps<typeof RNTextInput>,
  "editable"
> & {
  disabled?: boolean;
};

export type InputPressableProps = React.ComponentProps<typeof Pressable> & {
  disabled?: boolean;
  invalid?: boolean;
  focused?: boolean;
};

type UseInputFocusStateProps = {
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

// Components
export const Input = forwardRef<RNTextInput, InputProps>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <RNTextInput
        className={cn(
          "grow text-foreground text-md placeholder:text-muted-foreground",
          className
        )}
        editable={!disabled}
        ref={ref}
        {...props}
      />
    );
  }
);

export const InputPressable = ({
  children,
  disabled,
  invalid,
  focused,
  onPress,
  className,
}: InputPressableProps) => {
  return (
    <Pressable
      accessibilityState={{ disabled }}
      className={cn(
        "flex min-h-14 w-full grow flex-row items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs transition-color active:bg-accent/90 disabled:opacity-50 dark:active:bg-accent/50",
        invalid && "border-destructive",
        focused && "border-ring",
        className
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

// Hooks
export const useInputFocusState = ({
  onFocus,
  onBlur,
}: UseInputFocusStateProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const internalRef = useRef<RNTextInput>(null);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(e);

      setIsFocused(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlur?.(e);

      setIsFocused(false);
    },
    [onBlur]
  );

  const handlePress = useCallback(() => internalRef.current?.focus(), []);

  return {
    isFocused,
    internalRef,
    handleFocus,
    handleBlur,
    handlePress,
  };
};
