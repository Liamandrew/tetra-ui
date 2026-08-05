import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemLabel,
} from "@repo/tetra-ui/components/segmented-control";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function SegmentedControlScreen() {
  const [value, setValue] = useState("day");
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenHero>
      <SegmentedControl
        disabled={showDisabled}
        onValueChange={setValue}
        value={value}
      >
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

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch
          onValueChange={setShowDisabled}
          value={showDisabled}
        >
          Show Disabled
        </ComponentBehaviourSwitch>
      </ComponentBehaviourSheet>
    </ScreenHero>
  );
}
