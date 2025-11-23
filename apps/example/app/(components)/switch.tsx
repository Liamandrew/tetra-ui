import { Switch } from "@repo/tetra-ui/components/switch";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function SwitchScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Switch</ScreenHeading>

      <Section title="Examples">
        <Switch />
        <Switch disabled />
        <Switch checked disabled />
      </Section>
    </ScreenScrollView>
  );
}
