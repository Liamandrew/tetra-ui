import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@tetra-ui/native/components/field";
import { TextareaInput } from "@tetra-ui/native/components/textarea-input";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function TextareaInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>TextareaInput</ScreenHeading>

      <Section title="TextareaInput">
        <TextareaInput placeholder="Enter your email" />
      </Section>

      <Section title="TextareaInput Disabled">
        <TextareaInput
          disabled
          placeholder="Enter your email"
          value="Disabled"
        />
      </Section>

      <Section title="TextareaInput Invalid">
        <TextareaInput
          invalid
          placeholder="Enter your email"
          value="Disabled"
        />
      </Section>

      <ScreenHeading>TextareaField</ScreenHeading>

      <Section title="Default">
        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldControl>
            <TextareaInput placeholder="Enter your description" />
          </FieldControl>
          <FieldDescription>This is your description.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Disabled">
        <Field disabled>
          <FieldLabel>Description</FieldLabel>
          <FieldControl>
            <TextareaInput placeholder="Enter your description" />
          </FieldControl>
          <FieldDescription>This is your description.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
          <FieldLabel>Description</FieldLabel>
          <FieldControl>
            <TextareaInput placeholder="Enter your description" />
          </FieldControl>
          <FieldDescription>This is your description.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>
    </ScreenScrollView>
  );
}
