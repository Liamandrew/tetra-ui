import { useState } from "react";
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectInput,
  NativeSelectItem,
  NativeSelectTrigger,
} from "@/components/ui/native-select";

const OPTIONS = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export function NativeSelectPreview() {
  const [value, setValue] = useState("1");

  return (
    <NativeSelect onValueChange={setValue} value={value}>
      <NativeSelectTrigger asChild>
        <NativeSelectInput placeholder="Select..." />
      </NativeSelectTrigger>
      <NativeSelectContent>
        {OPTIONS.map((option) => (
          <NativeSelectItem
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </NativeSelectContent>
    </NativeSelect>
  );
}
