import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function SeparatorPreview() {
  return (
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
  );
}
