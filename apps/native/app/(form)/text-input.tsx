import { TextInput } from "@tetra-ui/native/components/text-input";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function TextInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>TextInput</ScreenHeading>

      <Section title="TextInput">
        <TextInput placeholder="Enter your email" />
      </Section>
      <Section title="TextInput Disabled">
        <TextInput disabled placeholder="Enter your email" value="Disabled" />
      </Section>
      <Section title="TextInput Invalid">
        <TextInput invalid placeholder="Enter your email" value="Disabled" />
      </Section>
    </ScreenScrollView>
  );
}
