import { Label } from "@repo/tetra-ui/components/label";
import { Stack } from "@repo/tetra-ui/components/stack";
import { ScreenHero } from "@/components/screen";

export default function HeadingScreen() {
  return (
    <ScreenHero>
      <Stack gap="md">
        <Label>Label</Label>
      </Stack>
    </ScreenHero>
  );
}
