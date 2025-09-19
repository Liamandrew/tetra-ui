import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from '@repo/tetra-ui/components/form';
import { TextInput } from '@repo/tetra-ui/components/text-input';
import { ScreenHeading } from '@/components/screen-heading';
import { ScreenScrollView } from '@/components/screen-scrollview';
import { Section } from '@/components/section';

export default function TextInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>TextInput</ScreenHeading>

      <Section title="TextInput">
        <TextInput placeholder="Enter your username" />
      </Section>

      <Section title="TextInput Disabled">
        <TextInput
          disabled
          placeholder="Enter your username"
          value="Disabled"
        />
      </Section>

      <Section title="TextInput Invalid">
        <TextInput invalid placeholder="Enter your username" value="Disabled" />
      </Section>

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
