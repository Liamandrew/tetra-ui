import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectInput,
  NativeSelectItem,
  NativeSelectSheetConfirm,
  NativeSelectSheetFooter,
} from "@/components/ui/native-select";
import { Stack } from "@/components/ui/stack";

const OPTIONS = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export function NativeSelectPreview() {
  const [value, setValue] = useState("1");
  const [confirmValue, setConfirmValue] = useState("1");

  return (
    <Stack className="w-full" gap="md">
      <NativeSelect onValueChange={setValue} value={value}>
        <NativeSelectInput placeholder="Select...">
          {OPTIONS.map((option) => (
            <NativeSelectItem
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </NativeSelectInput>
      </NativeSelect>

      <NativeSelect onValueChange={setConfirmValue} value={confirmValue}>
        <NativeSelectInput placeholder="Select with confirm...">
          {OPTIONS.map((option) => (
            <NativeSelectItem
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
          <NativeSelectSheetFooter>
            <NativeSelectSheetConfirm asChild>
              <Button>Confirm</Button>
            </NativeSelectSheetConfirm>
          </NativeSelectSheetFooter>
        </NativeSelectInput>
      </NativeSelect>
    </Stack>
  );
}
