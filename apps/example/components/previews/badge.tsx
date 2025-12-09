import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { BadgeCheck } from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";

export function BadgePreview() {
  return (
    <Stack gap="md">
      <Stack className="flex-wrap" direction="row" gap="md">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </Stack>

      <Stack className="flex-wrap" direction="row" gap="md">
        <Badge className="bg-blue-500 dark:bg-blue-600" variant="default">
          <BadgeIcon className="stroke-white">
            <BadgeCheck />
          </BadgeIcon>
          <BadgeText className="text-white">Badge</BadgeText>
        </Badge>

        <Badge
          className="h-7 min-w-7 rounded-full px-1 py-0.5"
          variant="default"
        >
          8
        </Badge>
        <Badge
          className="h-7 min-w-7 rounded-full px-1 py-0.5"
          variant="destructive"
        >
          99
        </Badge>
        <Badge
          className="h-7 min-w-7 rounded-full px-1 py-0.5"
          variant="outline"
        >
          20+
        </Badge>
      </Stack>
    </Stack>
  );
}
