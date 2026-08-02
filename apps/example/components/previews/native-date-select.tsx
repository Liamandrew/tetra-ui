import { useState } from "react";
import {
  NativeDateSelect,
  NativeDateSelectInput,
} from "@/components/ui/native-date-select";

export function NativeDateSelectPreview() {
  const [date, setDate] = useState(new Date());

  return (
    <NativeDateSelect mode="date" onValueChange={setDate} value={date}>
      <NativeDateSelectInput placeholder="Pick a date" />
    </NativeDateSelect>
  );
}
