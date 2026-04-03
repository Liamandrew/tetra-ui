import { Chip, ChipIcon, ChipText } from "@/components/ui/chip";
import { XIcon } from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";

export function ChipPreview() {
  return (
    <Stack gap="md">
      <Stack className="flex-wrap" direction="row" gap="md">
        <Chip variant="default">Default</Chip>
        <Chip variant="secondary">Secondary</Chip>
        <Chip variant="destructive">Destructive</Chip>
        <Chip variant="outline">Outline</Chip>
      </Stack>

      <Stack className="flex-wrap" direction="row" gap="md">
        <Chip
          className="bg-blue-500 active:bg-blue-700 dark:bg-blue-600 dark:active:bg-blue-500"
          variant="default"
        >
          <ChipText className="text-white">Chip</ChipText>
          <ChipIcon className="text-white">
            <XIcon />
          </ChipIcon>
        </Chip>
      </Stack>
    </Stack>
  );
}
