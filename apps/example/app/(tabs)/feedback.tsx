import { Skeleton } from "@repo/tetra-ui/components/skeleton";
import ComponentLink from "@/components/component-link";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function Feedback() {
  return (
    <ScreenScrollView>
      <Section title="Skeleton">
        <Skeleton className="h-6" />
        <ComponentLink href="/skeleton">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}
