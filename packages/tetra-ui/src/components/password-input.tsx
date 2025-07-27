import { useState } from 'react';
import { Button, ButtonIcon } from './button';
import { Eye, EyeOff } from './icons';
import { TextInput, type TextInputProps } from './text-input';

// Types
export type PasswordInputProps = Omit<
  TextInputProps,
  'rightElement' | 'secureTextEntry'
>;

// Components
export const PasswordInput = ({
  onFocus,
  onBlur,
  disabled,
  ...props
}: PasswordInputProps) => {
  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const Icon = isSecureEntry ? EyeOff : Eye;

  return (
    <TextInput
      {...props}
      disabled={disabled}
      rightElement={
        <Button
          disabled={disabled}
          onPress={() => setIsSecureEntry((p) => !p)}
          size="icon"
          variant="ghost"
        >
          <ButtonIcon>
            <Icon />
          </ButtonIcon>
        </Button>
      }
      secureTextEntry={isSecureEntry}
    />
  );
};
