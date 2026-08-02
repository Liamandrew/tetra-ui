import { AlertPreview } from "@/components/previews";
import { ScreenHero } from "@/components/screen";

export default function AlertScreen() {
  return (
    <ScreenHero className="bg-background">
      <AlertPreview />
    </ScreenHero>
  );
}
