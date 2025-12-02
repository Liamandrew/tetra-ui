import { Separator } from "@repo/tetra-ui/components/separator";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { ScreenHero } from "@/components/screen";

export default function SeparatorScreen() {
  return (
    <ScreenHero className="bg-background">
      <Stack className="w-full max-w-3/4 items-center" gap="md">
        <Stack gap="sm">
          <Text className="font-semibold">Tetra UI</Text>
          <Text className="text-muted-foreground">
            An open-source UI library for React Native
          </Text>
        </Stack>

        <Separator />

        <Stack direction="row" gap="md">
          <Text>Blog</Text>
          <Separator orientation="vertical" />
          <Text>About</Text>
          <Separator orientation="vertical" />
          <Text>Contact</Text>
        </Stack>
      </Stack>
    </ScreenHero>
  );
}
