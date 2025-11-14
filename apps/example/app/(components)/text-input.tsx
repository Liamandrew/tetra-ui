import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
} from "@repo/tetra-ui/components/form";
import { BadgeCheck, Search } from "@repo/tetra-ui/components/icons";
import { InputAddon, InputAddonIcon } from "@repo/tetra-ui/components/input";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { Text } from "react-native";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function TextInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>TextInput</ScreenHeading>

      <Section title="TextInput">
        <TextInput placeholder="Enter your username" />

        <TextInput placeholder="Enter your username">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
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
      </Section>

      <Section title="TextInput Disabled">
        <TextInput
          disabled
          placeholder="Enter your username"
          value="Disabled"
        />
        <TextInput disabled placeholder="Enter your username">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </TextInput>
      </Section>

      <Section title="TextInput Invalid">
        <TextInput invalid placeholder="Enter your username">
          <InputAddon>
            <InputAddonIcon>
              <BadgeCheck />
            </InputAddonIcon>
          </InputAddon>
        </TextInput>
      </Section>

      <ScreenHeading>TextField</ScreenHeading>

      <Section title="Default">
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username">
              <InputAddon>
                <InputAddonIcon>
                  <BadgeCheck />
                </InputAddonIcon>
              </InputAddon>
            </TextInput>
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Disabled">
        <Field disabled>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username">
              <InputAddon>
                <InputAddonIcon>
                  <BadgeCheck />
                </InputAddonIcon>
              </InputAddon>
            </TextInput>
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>

      <Section title="Error">
        <Field errorMessage="This is an error message" invalid>
          <FieldLabel>Username</FieldLabel>
          <FieldControl>
            <TextInput placeholder="Enter your username">
              <InputAddon>
                <InputAddonIcon>
                  <BadgeCheck />
                </InputAddonIcon>
              </InputAddon>
            </TextInput>
          </FieldControl>
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldErrorMessage />
        </Field>
      </Section>
    </ScreenScrollView>
  );
}
