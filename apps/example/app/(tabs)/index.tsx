import { Heading } from "@repo/tetra-ui/components/heading";
import { Label } from "@repo/tetra-ui/components/label";
import { Separator } from "@repo/tetra-ui/components/separator";
import ComponentLink from "@/components/component-link";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function Home() {
  return (
    <ScreenScrollView>
      <Section title="Heading">
        <Heading level="1">Heading 1</Heading>
        <Heading level="2">Heading 2</Heading>
        <Heading level="3">Heading 3</Heading>
        <Heading level="4">Heading 4</Heading>
        <Heading level="5">Heading 5</Heading>
        <Heading level="6">Heading 6</Heading>
      </Section>

      <Section title="Label">
        <Label>Label</Label>
      </Section>

      <Section title="Separator">
        <Separator />
        <ComponentLink href="/separator">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}
