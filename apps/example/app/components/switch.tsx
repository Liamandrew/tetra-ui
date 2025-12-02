import { Switch } from "@repo/tetra-ui/components/switch";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function SwitchScreen() {
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenHero>
      <Switch disabled={showDisabled} />

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch
          checked={showDisabled}
          onCheckedChange={setShowDisabled}
        >
          Show Disabled
        </ComponentBehaviourSwitch>
      </ComponentBehaviourSheet>
    </ScreenHero>
  );
}
