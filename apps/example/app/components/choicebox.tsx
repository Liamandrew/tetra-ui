import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "@repo/tetra-ui/components/choicebox";
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

export default function ChoiceboxScreen() {
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <>
      <ScreenScrollView>
        <ScreenHero className="bg-background">
          <Choicebox
            defaultValue="standard"
            disabled={showDisabled}
            invalid={showInvalid}
            type="single"
          >
            <ChoiceboxItem value="standard">
              <ChoiceboxItemHeader>
                <ChoiceboxItemTitle>Standard shipping</ChoiceboxItemTitle>
                <ChoiceboxItemDescription>
                  4–5 business days
                </ChoiceboxItemDescription>
              </ChoiceboxItemHeader>
            </ChoiceboxItem>
            <ChoiceboxItem value="express">
              <ChoiceboxItemHeader>
                <ChoiceboxItemTitle>Express shipping</ChoiceboxItemTitle>
                <ChoiceboxItemDescription>
                  1–2 business days
                </ChoiceboxItemDescription>
              </ChoiceboxItemHeader>
            </ChoiceboxItem>
          </Choicebox>
        </ScreenHero>

        <ScreenHero>
          <Choicebox
            defaultValue={["newsletter"]}
            disabled={showDisabled}
            invalid={showInvalid}
            type="multiple"
          >
            <ChoiceboxItem value="newsletter">Email updates</ChoiceboxItem>
            <ChoiceboxItem value="sms">SMS alerts</ChoiceboxItem>
            <ChoiceboxItem value="push">Push notifications</ChoiceboxItem>
          </Choicebox>
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
