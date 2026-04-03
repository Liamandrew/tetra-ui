import {
  Button,
  ButtonIcon,
  ButtonText,
} from "@repo/tetra-ui/components/button";
import { CalendarPlusIcon } from "@repo/tetra-ui/components/icons";
import {
  Select,
  SelectContentPopover,
  SelectItem,
  SelectTrigger,
} from "@repo/tetra-ui/components/select";
import { SelectPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

const OPTIONS = [
  { label: "Day", value: "1" },
  { label: "Week", value: "2" },
  { label: "Month", value: "3" },
  { label: "Year", value: "4" },
];

export default function SelectScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <SelectPreview />
      </ScreenHero>

      <ScreenHero className="bg-background">
        <Select options={OPTIONS} placeholder="Select...">
          <SelectTrigger asChild>
            <Button className="w-fit self-end" size="sm" variant="secondary">
              <ButtonIcon>
                <CalendarPlusIcon />
              </ButtonIcon>
              <ButtonText>Select</ButtonText>
            </Button>
          </SelectTrigger>
          <SelectContentPopover align="end" width={220}>
            {OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContentPopover>
        </Select>
      </ScreenHero>
    </ScreenScrollView>
  );
}
