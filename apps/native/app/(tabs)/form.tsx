import { Button } from "@tetra-ui/native/components/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@tetra-ui/native/components/field";
import { TextInput } from "@tetra-ui/native/components/text-input";
import { TextareaInput } from "@tetra-ui/native/components/textarea-input";
import ComponentLink from "@/components/component-link";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function Form() {
  return (
    <ScreenScrollView>
      <Section title="Button">
        <Button>Button</Button>
        <ComponentLink href="/button">View More</ComponentLink>
      </Section>

      <Section title="TextInput">
        <TextInput placeholder="Enter your email" />
        <ComponentLink href="/text-input">View More</ComponentLink>
      </Section>

      <Section title="TextField">
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username" />
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
        <ComponentLink href="/text-field">View More</ComponentLink>
      </Section>

      <Section title="TextareaInput">
        <TextareaInput placeholder="Enter your description" />
        <ComponentLink href="/textarea-input">View More</ComponentLink>
      </Section>

      <Section title="TextareaField">
        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldControl>
            <TextareaInput placeholder="Enter your description" />
          </FieldControl>
          <FieldDescription>This is your description.</FieldDescription>
          <FieldErrorMessage />
        </Field>
        <ComponentLink href="/textarea-field">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}
