import { Checkbox, CheckboxInput } from "@repo/tetra-ui/components/checkbox";
import { useState } from "react";
import { Pressable } from "react-native";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import {
  ScreenActionsButton,
  ScreenHero,
  ScreenScrollView,
} from "@/components/screen";

export default function CheckboxScreen() {
  const [checked, setChecked] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <>
      <ScreenScrollView>
        <ScreenHero className="bg-background">
          <Pressable onPress={() => setChecked((p) => !p)}>
            <Checkbox checked={checked} invalid={showInvalid} />
          </Pressable>
        </ScreenHero>

        <ScreenHero>
          <CheckboxInput
            checked={checked}
            disabled={showDisabled}
            invalid={showInvalid}
            onPress={() => setChecked(!checked)}
          >
            Do you agree to the terms and conditions?
          </CheckboxInput>
        </ScreenHero>
      </ScreenScrollView>

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
    </>
  );
}
