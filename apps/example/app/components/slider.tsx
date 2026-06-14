import { Slider } from "@repo/tetra-ui/components/slider";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function SwitchScreen() {
  const [value, setValue] = useState(50);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenHero>
      <Slider disabled={showDisabled} onValueChange={setValue} value={value} />

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
