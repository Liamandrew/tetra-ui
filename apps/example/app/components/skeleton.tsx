import { SkeletonPreview } from "@/components/previews";
import { ScreenHero } from "@/components/screen";

export default function SkeletonScreen() {
  return (
    <ScreenHero className="bg-background">
      <SkeletonPreview />
    </ScreenHero>
  );
}
