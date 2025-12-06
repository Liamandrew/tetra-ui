import { NativeSheetPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function NativeSheetScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <NativeSheetPreview />
      </ScreenHero>
    </ScreenScrollView>
  );
}
