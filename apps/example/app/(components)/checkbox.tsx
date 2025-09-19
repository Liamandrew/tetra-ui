import { Checkbox, CheckboxInput } from "@repo/tetra-ui/components/checkbox";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@repo/tetra-ui/components/form";
import { useState } from "react";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function CheckboxScreen() {
  const [checked, setChecked] = useState(false);
  return (
    <ScreenScrollView>
      <ScreenHeading>Checkbox</ScreenHeading>

      <Section title="Checkbox">
        <Checkbox />
      </Section>

      <Section title="Checkbox Checked">
        <Checkbox checked />
      </Section>

      <Section title="Checkbox Invalid">
        <Checkbox invalid />
      </Section>

      <ScreenHeading>CheckboxInput</ScreenHeading>

      <Section title="CheckboxInput">
        <CheckboxInput>Do you agree to the terms and conditions?</CheckboxInput>
      </Section>

      <Section title="CheckboxInput Checked">
        <CheckboxInput checked>
          Do you agree to the terms and conditions?
        </CheckboxInput>
      </Section>

      <Section title="CheckboxInput Disabled">
        <CheckboxInput disabled>
          Do you agree to the terms and conditions?
        </CheckboxInput>
      </Section>

      <Section title="CheckboxInput Invalid">
        <CheckboxInput invalid>
          Do you agree to the terms and conditions?
        </CheckboxInput>
      </Section>

      <ScreenHeading>CheckboxField</ScreenHeading>

      <Section title="Default">
        <Field>
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
      </Section>

      <Section title="Disabled">
        <Field disabled>
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
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
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
      </Section>
    </ScreenScrollView>
  );
}
