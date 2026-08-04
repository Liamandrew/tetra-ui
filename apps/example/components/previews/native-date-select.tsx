import { useState } from "react";
import {
  NativeDateSelect,
  NativeDateSelectContent,
  NativeDateSelectInput,
  NativeDateSelectTrigger,
} from "@/components/ui/native-date-select";

export function NativeDateSelectPreview() {
  const [date, setDate] = useState(new Date());

  return (
    <NativeDateSelect mode="date" onValueChange={setDate} value={date}>
      <NativeDateSelectTrigger asChild>
        <NativeDateSelectInput placeholder="Pick a date" />
      </NativeDateSelectTrigger>
      <NativeDateSelectContent />
    </NativeDateSelect>
  );
}
