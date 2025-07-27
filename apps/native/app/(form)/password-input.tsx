import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from '@tetra-ui/native/components/field';
import { PasswordInput } from '@tetra-ui/native/components/password-input';
import { ScreenHeading } from '@/components/screen-heading';
import { ScreenScrollView } from '@/components/screen-scrollview';
import { Section } from '@/components/section';

export default function PasswordInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>PasswordInput</ScreenHeading>

      <Section title="PasswordInput">
        <PasswordInput placeholder="Enter your password" />
      </Section>

      <Section title="PasswordInput Disabled">
        <PasswordInput
          disabled
          placeholder="Enter your password"
          value="Disabled"
        />
      </Section>

      <Section title="PasswordInput Invalid">
        <PasswordInput
          invalid
          placeholder="Enter your password"
          value="Disabled"
        />
      </Section>

      <ScreenHeading>PasswordField</ScreenHeading>

      <Section title="Default">
        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldControl>
            <PasswordInput placeholder="Enter your password" />
          </FieldControl>
          <FieldDescription>This should be secret.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Disabled">
        <Field disabled>
          <FieldLabel>Password</FieldLabel>
          <FieldControl>
            <PasswordInput placeholder="Enter your password" />
          </FieldControl>
          <FieldDescription>This should be secret.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
          <FieldLabel>Password</FieldLabel>
          <FieldControl>
            <PasswordInput placeholder="Enter your password" />
          </FieldControl>
          <FieldDescription>This should be secret.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>
    </ScreenScrollView>
  );
}
