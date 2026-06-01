import {
  BadgeCheckIcon,
  SearchIcon,
  XIcon,
} from "@repo/tetra-ui/components/icons";
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
                <BadgeCheckIcon />
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
                <SearchIcon />
              </InputAddonIcon>
            </InputAddon>

            {searchValue ? (
              <InputAddon align="inline-end">
                <InputAddonButton onPress={() => setSearchValue("")}>
                  <InputAddonButtonText>Clear</InputAddonButtonText>
                  <InputAddonButtonIcon>
                    <XIcon />
                  </InputAddonButtonIcon>
                </InputAddonButton>
              </InputAddon>
            ) : null}
          </TextInput>
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
