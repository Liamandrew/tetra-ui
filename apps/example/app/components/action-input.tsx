import { ActionInput } from "@repo/tetra-ui/components/action-input";
import { BadgeCheck } from "@repo/tetra-ui/components/icons";
import { InputAddon, InputAddonIcon } from "@repo/tetra-ui/components/input";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function ActionInputScreen() {
  const [open, setOpen] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [showCustomAddon, setShowCustomAddon] = useState(false);

  return (
    <ScreenHero>
      <ActionInput
        disabled={showDisabled}
        invalid={showInvalid}
        onPress={() => setOpen(true)}
        placeholder="Enter your address"
        value={showValue ? "123 Main St" : undefined}
      >
        <InputAddon>
          <InputAddonIcon>
            <BadgeCheck />
          </InputAddonIcon>
        </InputAddon>

        {showCustomAddon && (
          <InputAddon align="inline-end">
            <Text className="text-base text-muted-foreground">Search...</Text>
          </InputAddon>
        )}
      </ActionInput>

      <ComponentBehaviourSheet
        onOpenChange={setOpen}
        open={open}
        trigger={<ScreenActionsButton />}
      >
        <ComponentBehaviourSwitch
          checked={showValue}
          onCheckedChange={setShowValue}
        >
          Show Value
        </ComponentBehaviourSwitch>
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

        <ComponentBehaviourSwitch
          checked={showCustomAddon}
          onCheckedChange={setShowCustomAddon}
        >
          Show Custom Addon
        </ComponentBehaviourSwitch>
      </ComponentBehaviourSheet>
    </ScreenHero>
  );
}
