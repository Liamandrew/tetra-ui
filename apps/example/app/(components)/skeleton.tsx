import { Skeleton } from "@repo/tetra-ui/components/skeleton";
import { Stack } from "@repo/tetra-ui/components/stack";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function SkeletonScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Skeleton</ScreenHeading>
      <Section title="Example">
        <Stack direction="row" gap="sm">
          <Skeleton className="size-12 rounded-full" />

          <Stack className="flex-1" direction="column" gap="sm">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </Stack>
        </Stack>
      </Section>
    </ScreenScrollView>
  );
}
