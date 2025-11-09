import { useCallback, useRef, useState } from "react";
import {
  type BlurEvent,
  type FocusEvent,
  Pressable,
  TextInput as RNTextInput,
} from "react-native";
import { cn } from "../lib/utils";

// Types
export type InputProps = Omit<
  React.ComponentPropsWithRef<typeof RNTextInput>,
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
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
};

// Components
export const Input = ({ className, disabled, ...props }: InputProps) => {
  return (
    <RNTextInput
      className={cn(
        "grow text-base text-foreground leading-tight placeholder:text-muted-foreground",
        className
      )}
      editable={!disabled}
      {...props}
    />
  );
};

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
        "flex min-h-12 w-full grow flex-row items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs transition-color active:bg-accent/90 disabled:opacity-50 dark:active:bg-accent/50",
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
    (e: FocusEvent) => {
      onFocus?.(e);

      setIsFocused(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: BlurEvent) => {
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
