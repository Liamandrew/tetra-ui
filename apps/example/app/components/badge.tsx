import { BadgePreview } from "@/components/previews";
import { ScreenHero } from "@/components/screen";

export default function BadgeScreen() {
  return (
    <ScreenHero className="bg-background">
      <BadgePreview />
    </ScreenHero>
  );
}
