import { Checkbox, CheckboxInput } from "@repo/tetra-ui/components/checkbox";
import { useState } from "react";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function CheckboxScreen() {
  const [checked, setChecked] = useState(false);
  return (
    <ScreenScrollView>
      <ScreenHeading>Checkbox</ScreenHeading>

      <Section title="Examples">
        <Checkbox />
        <Checkbox checked />
        <Checkbox invalid />
      </Section>

      <Section title="CheckboxInput">
        <CheckboxInput checked={checked} onPress={() => setChecked(!checked)}>
          Do you agree to the terms and conditions?
        </CheckboxInput>

        <CheckboxInput
          checked={checked}
          disabled
          onPress={() => setChecked(!checked)}
        >
          Do you agree to the terms and conditions?
        </CheckboxInput>

        <CheckboxInput
          checked={checked}
          invalid
          onPress={() => setChecked(!checked)}
        >
          Do you agree to the terms and conditions?
        </CheckboxInput>
      </Section>
    </ScreenScrollView>
  );
}
