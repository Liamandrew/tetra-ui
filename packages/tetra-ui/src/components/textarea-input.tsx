import { cn } from '../lib/utils';
import {
  Input,
  InputPressable,
  type InputProps,
  useInputFocusState,
} from './input';

// Types
export type TextareaInputProps = InputProps & {
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
};

// Components
export const TextareaInput = ({
  onFocus,
  onBlur,
  disabled,
  invalid,
  className,
  ...props
}: TextareaInputProps) => {
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
        className={cn('min-h-24', className)}
        disabled={disabled}
        multiline
        onBlur={handleBlur}
        onFocus={handleFocus}
        pointerEvents={isFocused || disabled ? undefined : 'none'}
        ref={internalRef}
        scrollEnabled={false}
        textAlignVertical="top"
      />
    </InputPressable>
  );
};
