import { ActionInput } from '@repo/tetra-ui/components/action-input';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from '@repo/tetra-ui/components/form';
import { ScreenHeading } from '@/components/screen-heading';
import { ScreenScrollView } from '@/components/screen-scrollview';
import { Section } from '@/components/section';

export default function ActionInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>ActionInput</ScreenHeading>

      <Section title="ActionInput">
        <ActionInput placeholder="Enter your address" />
      </Section>

      <Section title="ActionInput Disabled">
        <ActionInput
          disabled
          placeholder="Enter your address"
          value="Disabled"
        />
      </Section>

      <Section title="ActionInput Invalid">
        <ActionInput
          invalid
          placeholder="Enter your address"
          value="Disabled"
        />
      </Section>

      <ScreenHeading>ActionField</ScreenHeading>

      <Section title="Default">
        <Field>
          <FieldLabel>Address</FieldLabel>
          <FieldControl>
            <ActionInput placeholder="Enter your address" />
          </FieldControl>
          <FieldDescription>This is your residential address.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Disabled">
        <Field disabled>
          <FieldLabel>Address</FieldLabel>
          <FieldControl>
            <ActionInput placeholder="Enter your address" />
          </FieldControl>
          <FieldDescription>This is your residential address.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
          <FieldLabel>Address</FieldLabel>
          <FieldControl>
            <ActionInput placeholder="Enter your address" />
          </FieldControl>
          <FieldDescription>This is your residential address.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>
    </ScreenScrollView>
  );
}
