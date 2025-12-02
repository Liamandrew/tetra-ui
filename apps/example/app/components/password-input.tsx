import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function PasswordInputScreen() {
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenHero>
      <PasswordInput
        disabled={showDisabled}
        invalid={showInvalid}
        placeholder="Enter your password"
      />

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch
          checked={showInvalid}
          onCheckedChange={setShowInvalid}
        >
          Show Invalid
        </ComponentBehaviourSwitch>
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
