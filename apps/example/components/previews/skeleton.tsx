import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "@/components/ui/stack";

export function SkeletonPreview() {
  return (
    <Stack direction="row" gap="sm">
      <Skeleton className="size-12 rounded-full" />

      <Stack className="flex-1" direction="column" gap="sm">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </Stack>
    </Stack>
  );
}
