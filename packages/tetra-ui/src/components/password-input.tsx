import { useState } from "react";
import { Button, ButtonIcon } from "./button";
import { Eye, EyeOff } from "./icons";
import { TextInput, type TextInputProps } from "./text-input";

// Types
export type PasswordInputProps = Omit<
  TextInputProps,
  "rightElement" | "secureTextEntry"
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
          className="size-7"
          disabled={disabled}
          onPress={() => setIsSecureEntry((p) => !p)}
          size="icon"
          variant="ghost"
        >
          <ButtonIcon className="size-6">
            <Icon />
          </ButtonIcon>
        </Button>
      }
      secureTextEntry={isSecureEntry}
    />
  );
};
