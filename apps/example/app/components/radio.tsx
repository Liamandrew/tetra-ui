import { Radio } from "@repo/tetra-ui/components/radio";
import { useState } from "react";
import { Pressable } from "react-native";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function RadioScreen() {
  const [checked, setChecked] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenHero className="bg-background">
      <Pressable disabled={showDisabled} onPress={() => setChecked((p) => !p)}>
        <Radio checked={checked} invalid={showInvalid} />
      </Pressable>

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch
          onValueChange={setShowInvalid}
          value={showInvalid}
        >
          Show Invalid
        </ComponentBehaviourSwitch>
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
