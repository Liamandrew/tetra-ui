import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContentPopover,
  SelectContentSheet,
  SelectContentSheetBody,
  SelectContentSheetConfirm,
  SelectContentSheetFooter,
  SelectContentSheetHeader,
  SelectContentSheetTitle,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

const OPTIONS = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export function SelectPreview() {
  return (
    <Stack className="w-full" gap="md">
      <Select options={OPTIONS} placeholder="Select...">
        <SelectTrigger asChild>
          <SelectInput />
        </SelectTrigger>

        <SelectContentSheet>
          <SelectContentSheetHeader>
            <SelectContentSheetTitle>Select a value</SelectContentSheetTitle>
          </SelectContentSheetHeader>
          <SelectContentSheetBody>
            {OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContentSheetBody>
          <SelectContentSheetFooter>
            <SelectContentSheetConfirm asChild>
              <Button>Confirm</Button>
            </SelectContentSheetConfirm>
          </SelectContentSheetFooter>
        </SelectContentSheet>
      </Select>

      <Select options={OPTIONS} placeholder="Select...">
        <SelectTrigger asChild>
          <SelectInput />
        </SelectTrigger>

        <SelectContentPopover>
          {OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              label={option.label}
              value={option.value}
            >
              <Stack gap="xs">
                <SelectItemLabel>{option.label}</SelectItemLabel>
                <Text className="text-muted-foreground text-sm">
                  This is a description for {option.label}
                </Text>
              </Stack>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectContentPopover>
      </Select>
    </Stack>
  );
}
