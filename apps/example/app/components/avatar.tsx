import { AvatarPreview } from "@/components/previews";
import { ScreenHero } from "@/components/screen";

export default function AvatarScreen() {
  return (
    <ScreenHero className="bg-background">
      <AvatarPreview />
    </ScreenHero>
  );
}
