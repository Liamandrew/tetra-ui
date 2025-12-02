import { Heading } from "@repo/tetra-ui/components/heading";
import { Stack } from "@repo/tetra-ui/components/stack";
import { ScreenHero } from "@/components/screen";

export default function HeadingScreen() {
  return (
    <ScreenHero>
      <Stack gap="md">
        <Heading level="1">Heading 1</Heading>
        <Heading level="2">Heading 2</Heading>
        <Heading level="3">Heading 3</Heading>
        <Heading level="4">Heading 4</Heading>
        <Heading level="5">Heading 5</Heading>
        <Heading level="6">Heading 6</Heading>
      </Stack>
    </ScreenHero>
  );
}
