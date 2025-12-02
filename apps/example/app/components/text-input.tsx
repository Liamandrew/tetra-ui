import { BadgeCheck, Search, X } from "@repo/tetra-ui/components/icons";
import {
  InputAddon,
  InputAddonButton,
  InputAddonButtonIcon,
  InputAddonButtonText,
  InputAddonIcon,
} from "@repo/tetra-ui/components/input";
import { Stack } from "@repo/tetra-ui/components/stack";
import { TextInput } from "@repo/tetra-ui/components/text-input";
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

export default function TextInputScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenScrollView>
      <ScreenHero>
        <Stack className="w-full" gap="lg">
          <TextInput
            disabled={showDisabled}
            invalid={showInvalid}
            placeholder="Enter your username"
          />

          <TextInput
            disabled={showDisabled}
            invalid={showInvalid}
            placeholder="Enter your username"
          >
            <InputAddon>
              <InputAddonIcon>
                <BadgeCheck />
              </InputAddonIcon>
            </InputAddon>
          </TextInput>

          <TextInput
            disabled={showDisabled}
            invalid={showInvalid}
            onChangeText={setSearchValue}
            placeholder="Search..."
            value={searchValue}
          >
            <InputAddon align="inline-start">
              <InputAddonIcon>
                <Search />
              </InputAddonIcon>
            </InputAddon>

            {searchValue ? (
              <InputAddon align="inline-end">
                <InputAddonButton onPress={() => setSearchValue("")}>
                  <InputAddonButtonText>Clear</InputAddonButtonText>
                  <InputAddonButtonIcon>
                    <X />
                  </InputAddonButtonIcon>
                </InputAddonButton>
              </InputAddon>
            ) : null}
          </TextInput>
        </Stack>

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
    </ScreenScrollView>
  );
}
