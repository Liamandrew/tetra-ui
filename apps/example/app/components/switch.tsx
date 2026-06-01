import { Switch } from "@repo/tetra-ui/components/switch";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function SwitchScreen() {
  const [value, setValue] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenHero>
      <Switch disabled={showDisabled} onValueChange={setValue} value={value} />

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
