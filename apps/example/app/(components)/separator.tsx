import { Separator } from "@repo/tetra-ui/components/separator";
import { Stack } from "@repo/tetra-ui/components/stack";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function SeparatorScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Separator</ScreenHeading>
      <Section title="Horizontal">
        <Separator thickness="thin" />
        <Separator thickness="thick" />
      </Section>

      <Section title="Vertical">
        <Stack className="h-[100px]" direction="row" gap="2xl">
          <Separator orientation="vertical" thickness="thin" />
          <Separator orientation="vertical" thickness="thick" />
        </Stack>
      </Section>
    </ScreenScrollView>
  );
}
