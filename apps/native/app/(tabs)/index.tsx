import { Heading } from "@tetra-ui/native/components/heading";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function Home() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Typography</ScreenHeading>

      <Section title="Heading">
        <Heading level="1">Heading 1</Heading>
        <Heading level="2">Heading 2</Heading>
        <Heading level="3">Heading 3</Heading>
        <Heading level="4">Heading 4</Heading>
        <Heading level="5">Heading 5</Heading>
        <Heading level="6">Heading 6</Heading>
      </Section>
    </ScreenScrollView>
  );
}
