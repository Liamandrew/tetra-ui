import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/tetra-ui/components/button";
import {
  Field,
  FieldControl,
  FieldErrorMessage,
  FieldLabel,
  validateField,
} from "@repo/tetra-ui/components/form";
import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function FormScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Form</ScreenHeading>

      <Section title="Login">
        <HookForm />
      </Section>
    </ScreenScrollView>
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
    <>
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
    </>
  );
};
