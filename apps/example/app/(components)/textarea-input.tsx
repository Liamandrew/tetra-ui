import { TextareaInput } from "@repo/tetra-ui/components/textarea-input";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function TextareaInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>TextareaInput</ScreenHeading>

      <Section title="Examples">
        <TextareaInput placeholder="Enter your email" />

        <TextareaInput
          disabled
          placeholder="Enter your email"
          value="This is disabled"
        />

        <TextareaInput invalid placeholder="Enter your email" />
      </Section>
    </ScreenScrollView>
  );
}
