import { BadgeCheck, Search, X } from "@repo/tetra-ui/components/icons";
import {
  InputAddon,
  InputAddonButton,
  InputAddonButtonIcon,
  InputAddonButtonText,
  InputAddonIcon,
} from "@repo/tetra-ui/components/input";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { useState } from "react";
import { Text } from "react-native";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function TextInputScreen() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <ScreenScrollView>
      <ScreenHeading>TextInput</ScreenHeading>

      <Section title="Examples">
        <TextInput placeholder="Enter your username" />

        <TextInput placeholder="Enter your username">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </TextInput>

        <TextInput
          onChangeText={setSearchValue}
          placeholder="Search..."
          value={searchValue}
        >
          <InputAddon align="inline-end">
            <InputAddonButton onPress={() => setSearchValue("")}>
              <InputAddonButtonText>Clear</InputAddonButtonText>
              <InputAddonButtonIcon>
                <X />
              </InputAddonButtonIcon>
            </InputAddonButton>
          </InputAddon>
        </TextInput>

        <TextInput placeholder="Search...">
          <InputAddon align="inline-start">
            <InputAddonIcon>
              <Search />
            </InputAddonIcon>
          </InputAddon>
          <InputAddon align="inline-end">
            <Text className="text-base text-muted-foreground">12 results</Text>
          </InputAddon>
        </TextInput>

        <TextInput disabled placeholder="Enter your username">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </TextInput>

        <TextInput invalid placeholder="Enter your username">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </TextInput>
      </Section>
    </ScreenScrollView>
  );
}
