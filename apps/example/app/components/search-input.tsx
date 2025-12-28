import { X } from "@repo/tetra-ui/components/icons";
import {
  InputAddon,
  InputAddonButton,
  InputAddonButtonIcon,
} from "@repo/tetra-ui/components/input";
import { SearchInput } from "@repo/tetra-ui/components/search-input";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ScreenActionsButton, ScreenHero } from "@/components/screen";

export default function SearchInputScreen() {
  const [showDisabled, setShowDisabled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <ScreenHero className="bg-background">
      <SearchInput
        disabled={showDisabled}
        onChangeText={setSearchValue}
        placeholder="Search..."
        value={searchValue}
      >
        {searchValue ? (
          <InputAddon align="inline-end">
            <InputAddonButton
              className="size-7"
              onPress={() => setSearchValue("")}
              variant="link"
            >
              <InputAddonButtonIcon>
                <X />
              </InputAddonButtonIcon>
            </InputAddonButton>
          </InputAddon>
        ) : null}
      </SearchInput>

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
