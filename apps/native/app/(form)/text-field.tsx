import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@tetra-ui/native/components/field";
import { TextInput } from "@tetra-ui/native/components/text-input";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function TextFieldScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>TextField</ScreenHeading>

      <Section title="Default">
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username" />
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Disabled">
        <Field disabled>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username" />
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username" />
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>
    </ScreenScrollView>
  );
}
