import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Stack } from "@/components/ui/stack";

const AVATAR_SRC =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

export function AvatarPreview() {
  return (
    <Stack gap="md">
      <Stack className="items-end" direction="row" gap="md">
        <Avatar size="sm">
          <AvatarImage alt="Avatar" src={AVATAR_SRC} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <Avatar size="default">
          <AvatarImage alt="Avatar" src={AVATAR_SRC} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <Avatar size="lg">
          <AvatarImage alt="Avatar" src={AVATAR_SRC} />
          <AvatarFallback>JD</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </Stack>

      <Stack className="items-center" direction="row" gap="md">
        <Avatar>
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>

        <AvatarGroup>
          <Avatar>
            <AvatarImage alt="Avatar" src={AVATAR_SRC} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
