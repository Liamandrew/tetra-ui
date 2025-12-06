import { ActionInput } from "@/components/ui/action-input";
import { CheckboxInput } from "@/components/ui/checkbox";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@/components/ui/form";
import { BadgeCheck } from "@/components/ui/icons";
import { InputAddon, InputAddonIcon } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Stack } from "@/components/ui/stack";
import { TextInput } from "@/components/ui/text-input";
import { TextareaInput } from "@/components/ui/textarea-input";

export function FormPreview() {
  return (
    <Stack className="w-full" gap="lg">
      <Field>
        <FieldLabel>Address</FieldLabel>
        <FieldControl>
          <ActionInput placeholder="Enter your address">
            <InputAddon>
              <InputAddonIcon>
                <BadgeCheck />
              </InputAddonIcon>
            </InputAddon>
          </ActionInput>
        </FieldControl>
        <FieldDescription>This is your residential address.</FieldDescription>
        <FieldErrorMessage />
      </Field>

      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldControl>
          <CheckboxInput>
            Do you agree to the terms and conditions?
          </CheckboxInput>
        </FieldControl>
        <FieldDescription>
          You must agree to the terms and conditions.
        </FieldDescription>
        <FieldErrorMessage />
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldControl>
          <PasswordInput placeholder="Enter your password" />
        </FieldControl>
        <FieldDescription>This should be secret.</FieldDescription>
        <FieldErrorMessage />
      </Field>

      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldControl>
          <TextInput placeholder="Enter your username">
            <InputAddon>
              <InputAddonIcon>
                <BadgeCheck />
              </InputAddonIcon>
            </InputAddon>
          </TextInput>
        </FieldControl>
        <FieldDescription>This is your public display name.</FieldDescription>
        <FieldErrorMessage />
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <FieldControl>
          <TextareaInput placeholder="Enter your description" />
        </FieldControl>
        <FieldDescription>This is your description.</FieldDescription>
        <FieldErrorMessage />
      </Field>
    </Stack>
  );
}
