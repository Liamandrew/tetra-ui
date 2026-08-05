import { useState } from "react";
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemLabel,
} from "@/components/ui/segmented-control";

export function SegmentedControlPreview() {
  const [value, setValue] = useState("day");

  return (
    <SegmentedControl onValueChange={setValue} value={value}>
      <SegmentedControlItem value="day">
        <SegmentedControlItemLabel>Day</SegmentedControlItemLabel>
      </SegmentedControlItem>
      <SegmentedControlItem value="week">
        <SegmentedControlItemLabel>Week</SegmentedControlItemLabel>
      </SegmentedControlItem>
      <SegmentedControlItem value="month">
        <SegmentedControlItemLabel>Month</SegmentedControlItemLabel>
      </SegmentedControlItem>
    </SegmentedControl>
  );
}
