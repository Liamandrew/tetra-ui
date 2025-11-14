import { ActionInput } from "@repo/tetra-ui/components/action-input";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@repo/tetra-ui/components/form";
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

      <Section title="ActionInput">
        <ActionInput placeholder="Enter your address" />
        <ActionInput placeholder="Enter your address">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>
        <ActionInput placeholder="Enter your address">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
          <InputAddon align="inline-end">
            <Text className="text-base text-muted-foreground">Press</Text>
          </InputAddon>
        </ActionInput>
      </Section>

      <Section title="ActionInput Disabled">
        <ActionInput disabled placeholder="Enter your address" value="Disabled">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>
      </Section>

      <Section title="ActionInput Invalid">
        <ActionInput invalid placeholder="Enter your address">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </ActionInput>
      </Section>

      <ScreenHeading>ActionField</ScreenHeading>

      <Section title="Default">
        <Field>
          <FieldLabel>Address</FieldLabel>
          <FieldControl>
            <ActionInput placeholder="Enter your address">
              <InputAddon>
                <InputAddonIcon>
                  <BadgeCheck />
                </InputAddonIcon>
              </InputAddon>
            </ActionInput>
          </FieldControl>
          <FieldDescription>This is your residential address.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Disabled">
        <Field disabled>
          <FieldLabel>Address</FieldLabel>
          <FieldControl>
            <ActionInput placeholder="Enter your address">
              <InputAddon>
                <InputAddonIcon>
                  <BadgeCheck />
                </InputAddonIcon>
              </InputAddon>
            </ActionInput>
          </FieldControl>
          <FieldDescription>This is your residential address.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
          <FieldLabel>Address</FieldLabel>
          <FieldControl>
            <ActionInput placeholder="Enter your address">
              <InputAddon>
                <InputAddonIcon>
                  <BadgeCheck />
                </InputAddonIcon>
              </InputAddon>
            </ActionInput>
          </FieldControl>
          <FieldDescription>This is your residential address.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>
    </ScreenScrollView>
  );
}
