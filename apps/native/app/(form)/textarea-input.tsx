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
    </ScreenScrollView>
  );
}
