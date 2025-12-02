import { zodResolver } from "@hookform/resolvers/zod";
import { ActionInput } from "@repo/tetra-ui/components/action-input";
import { Button } from "@repo/tetra-ui/components/button";
import { CheckboxInput } from "@repo/tetra-ui/components/checkbox";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
  validateField,
} from "@repo/tetra-ui/components/form";
import { BadgeCheck } from "@repo/tetra-ui/components/icons";
import { InputAddon, InputAddonIcon } from "@repo/tetra-ui/components/input";
import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import { Stack } from "@repo/tetra-ui/components/stack";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { TextareaInput } from "@repo/tetra-ui/components/textarea-input";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import {
  ScreenActionsButton,
  ScreenHero,
  ScreenScrollView,
} from "@/components/screen";

export default function FormScreen() {
  const [checked, setChecked] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <>
      <ScreenScrollView>
        <ScreenHero className="justify-start pt-6">
          <Stack className="w-full" gap="lg">
            <Field
              disabled={showDisabled}
              errorMessage={showInvalid ? "This is required" : undefined}
              invalid={showInvalid}
            >
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
              <FieldDescription>
                This is your residential address.
              </FieldDescription>
              <FieldErrorMessage />
            </Field>

            <Field
              disabled={showDisabled}
              errorMessage={showInvalid ? "This is required" : undefined}
              invalid={showInvalid}
            >
              <FieldLabel>Username</FieldLabel>
              <FieldControl>
                <CheckboxInput
                  checked={checked}
                  onPress={() => setChecked(!checked)}
                >
                  Do you agree to the terms and conditions?
                </CheckboxInput>
              </FieldControl>
              <FieldDescription>
                You must agree to the terms and conditions.
              </FieldDescription>
              <FieldErrorMessage />
            </Field>

            <Field
              disabled={showDisabled}
              errorMessage={showInvalid ? "This is required" : undefined}
              invalid={showInvalid}
            >
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <PasswordInput placeholder="Enter your password" />
              </FieldControl>
              <FieldDescription>This should be secret.</FieldDescription>
              <FieldErrorMessage />
            </Field>

            <Field
              disabled={showDisabled}
              errorMessage={showInvalid ? "This is required" : undefined}
              invalid={showInvalid}
            >
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
              <FieldDescription>
                This is your public display name.
              </FieldDescription>
              <FieldErrorMessage />
            </Field>

            <Field
              disabled={showDisabled}
              errorMessage={showInvalid ? "This is required" : undefined}
              invalid={showInvalid}
            >
              <FieldLabel>Description</FieldLabel>
              <FieldControl>
                <TextareaInput placeholder="Enter your description" />
              </FieldControl>
              <FieldDescription>This is your description.</FieldDescription>
              <FieldErrorMessage />
            </Field>
          </Stack>
        </ScreenHero>

        <ScreenHero>
          <HookForm />
        </ScreenHero>
      </ScreenScrollView>

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch
          checked={showInvalid}
          onCheckedChange={setShowInvalid}
        >
          Show Invalid
        </ComponentBehaviourSwitch>
        <ComponentBehaviourSwitch
          checked={showDisabled}
          onCheckedChange={setShowDisabled}
        >
          Show Disabled
        </ComponentBehaviourSwitch>
      </ComponentBehaviourSheet>
    </>
  );
}

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const HookForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  return (
    <Stack className="w-full" gap="lg">
      <Controller
        control={form.control}
        name="username"
        render={({ field, formState }) => (
          <Field {...validateField(formState.errors, "username")}>
            <FieldLabel>Username</FieldLabel>
            <FieldControl>
              <TextInput
                onChangeText={field.onChange}
                placeholder="Enter your username"
                value={field.value}
              />
            </FieldControl>
            <FieldErrorMessage />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field, formState }) => (
          <Field {...validateField(formState.errors, "password")}>
            <FieldLabel>Password</FieldLabel>
            <FieldControl>
              <PasswordInput
                onChangeText={field.onChange}
                placeholder="Enter your password"
                value={field.value}
              />
            </FieldControl>
            <FieldErrorMessage />
          </Field>
        )}
      />

      <Button onPress={form.handleSubmit(onSubmit)}>Submit</Button>
    </Stack>
  );
};
