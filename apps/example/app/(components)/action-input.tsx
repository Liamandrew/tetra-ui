import { ActionInput } from "@repo/tetra-ui/components/action-input";
import { BadgeCheck } from "@repo/tetra-ui/components/icons";
import { InputAddon, InputAddonIcon } from "@repo/tetra-ui/components/input";
import { Text } from "react-native";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function ActionInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>ActionInput</ScreenHeading>

      <Section title="Examples">
        <ActionInput placeholder="Enter your address" />

        <ActionInput placeholder="Enter your address">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>

        <ActionInput placeholder="Enter your address" value="123 Main St">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>

        <ActionInput placeholder="View details">
          <InputAddon align="inline-end">
            <Text className="text-base text-muted-foreground">More...</Text>
          </InputAddon>
        </ActionInput>

        <ActionInput
          disabled
          placeholder="Enter your address"
          value="This is disabled"
        >
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>

        <ActionInput invalid placeholder="This is invalid">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>
      </Section>
    </ScreenScrollView>
  );
}
