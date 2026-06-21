import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@repo/tetra-ui/components/otp-input";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import {
  ScreenActionsButton,
  ScreenHero,
  ScreenScrollView,
} from "@/components/screen";

export default function OTPInputScreen() {
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenScrollView>
      <ScreenHero>
        <Stack className="w-full" gap="lg">
          <Stack gap="sm">
            <Text className="font-medium text-sm">6-digit code</Text>
            <OTPInput
              disabled={showDisabled}
              invalid={showInvalid}
              maxLength={6}
              onComplete={() => undefined}
            >
              <OTPInputGroup>
                <OTPInputSlot index={0} />
                <OTPInputSlot index={1} />
                <OTPInputSlot index={2} />
              </OTPInputGroup>
              <OTPInputSeparator />
              <OTPInputGroup>
                <OTPInputSlot index={3} />
                <OTPInputSlot index={4} />
                <OTPInputSlot index={5} />
              </OTPInputGroup>
            </OTPInput>
          </Stack>

          <Stack gap="sm">
            <Text className="font-medium text-sm">4-digit PIN</Text>
            <OTPInput
              disabled={showDisabled}
              invalid={showInvalid}
              maxLength={4}
              secureTextEntry
            >
              <OTPInputSlot index={0} />
              <OTPInputSlot index={1} />
              <OTPInputSlot index={2} />
              <OTPInputSlot index={3} />
            </OTPInput>
          </Stack>
        </Stack>

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
    </ScreenScrollView>
  );
}
