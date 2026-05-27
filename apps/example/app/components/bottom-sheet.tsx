import { BottomSheetPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function BottomSheetScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <BottomSheetPreview />
      </ScreenHero>
    </ScreenScrollView>
  );
}
