import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/registry/ui/icons";
import {
  InputAddon,
  InputAddonButton,
  InputAddonButtonIcon,
} from "@/registry/ui/input";
import { TextInput, type TextInputProps } from "@/registry/ui/text-input";

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

  const Icon = isSecureEntry ? EyeOffIcon : EyeIcon;

  return (
    <TextInput
      {...props}
      disabled={disabled}
      onBlur={onBlur}
      onFocus={onFocus}
      secureTextEntry={isSecureEntry}
    >
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
