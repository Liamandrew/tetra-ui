import { useState } from "react";
import { Eye, EyeOff } from "./icons";
import { InputAddon, InputAddonButton, InputAddonButtonIcon } from "./input";
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
    <TextInput {...props} disabled={disabled} secureTextEntry={isSecureEntry}>
      <InputAddon align="inline-end">
        <InputAddonButton
          disabled={disabled}
          onPress={() => setIsSecureEntry((p) => !p)}
          size="icon"
          variant="ghost"
        >
          <InputAddonButtonIcon>
            <Icon />
          </InputAddonButtonIcon>
        </InputAddonButton>
      </InputAddon>
    </TextInput>
  );
};
