import { SelectPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function SelectScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <SelectPreview />
      </ScreenHero>
    </ScreenScrollView>
  );
}
