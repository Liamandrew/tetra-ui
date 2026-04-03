import { EmptyPreview } from "@/components/previews";
import { ScreenHero } from "@/components/screen";

export default function EmptyScreen() {
  return (
    <ScreenHero className="bg-background">
      <EmptyPreview />
    </ScreenHero>
  );
}
