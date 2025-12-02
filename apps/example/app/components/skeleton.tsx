import { Skeleton } from "@repo/tetra-ui/components/skeleton";
import { Stack } from "@repo/tetra-ui/components/stack";
import { ScreenHero } from "@/components/screen";

export default function SkeletonScreen() {
  return (
    <ScreenHero className="bg-background">
      <Stack direction="row" gap="sm">
        <Skeleton className="size-12 rounded-full" />

        <Stack className="flex-1" direction="column" gap="sm">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </Stack>
      </Stack>
    </ScreenHero>
  );
}
