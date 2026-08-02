import { Button } from "@repo/tetra-ui/components/button";
import { InputAddon } from "@repo/tetra-ui/components/input";
import { Label } from "@repo/tetra-ui/components/label";
import {
  NativeSelect,
  NativeSelectInput,
  NativeSelectItem,
  NativeSelectSheetConfirm,
  NativeSelectSheetFooter,
} from "@repo/tetra-ui/components/native-select";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import { Platform } from "react-native";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { NativeSelectPreview } from "@/components/previews";
import {
  ScreenActionsButton,
  ScreenHero,
  ScreenScrollView,
} from "@/components/screen";

const OPTIONS = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function NativeSelectScreen() {
  const [wheelValue, setWheelValue] = useState("1");
  const [confirmValue, setConfirmValue] = useState("1");
  const [menuInputValue, setMenuInputValue] = useState("1");
  const [menuValue, setMenuValue] = useState("1");
  const [standaloneWheelValue, setStandaloneWheelValue] = useState("2");
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <NativeSelectPreview />
      </ScreenHero>

      <ScreenHero className="items-stretch bg-background">
        <Stack className="w-full" gap="md">
          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Input — wheel</Text>
            <NativeSelect
              disabled={showDisabled}
              onValueChange={setWheelValue}
              value={wheelValue}
            >
              <NativeSelectInput placeholder="Select...">
                {OPTIONS.map((option) => (
                  <NativeSelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </NativeSelectInput>
            </NativeSelect>
          </Stack>

          {Platform.OS === "ios" ? (
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">
                Input — wheel with confirm
              </Text>
              <NativeSelect
                disabled={showDisabled}
                onValueChange={setConfirmValue}
                value={confirmValue}
              >
                <NativeSelectInput placeholder="Select with confirm...">
                  {OPTIONS.map((option) => (
                    <NativeSelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                  <NativeSelectSheetFooter>
                    <NativeSelectSheetConfirm asChild>
                      <Button>Confirm</Button>
                    </NativeSelectSheetConfirm>
                  </NativeSelectSheetFooter>
                </NativeSelectInput>
              </NativeSelect>
            </Stack>
          ) : null}

          {Platform.OS === "ios" ? (
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">
                Input — menu
              </Text>
              <NativeSelect
                disabled={showDisabled}
                onValueChange={setMenuInputValue}
                value={menuInputValue}
              >
                <NativeSelectInput appearance="menu" placeholder="Select...">
                  <InputAddon align="inline-start">
                    <Label>Choice</Label>
                  </InputAddon>
                  {OPTIONS.map((option) => (
                    <NativeSelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </NativeSelectInput>
              </NativeSelect>
            </Stack>
          ) : null}

          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Menu</Text>
            <NativeSelect
              appearance="menu"
              disabled={showDisabled}
              onValueChange={setMenuValue}
              value={menuValue}
            >
              {OPTIONS.map((option) => (
                <NativeSelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </NativeSelect>
          </Stack>

          {Platform.OS === "ios" ? (
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">Wheel</Text>
              <NativeSelect
                appearance="wheel"
                disabled={showDisabled}
                onValueChange={setStandaloneWheelValue}
                value={standaloneWheelValue}
              >
                {OPTIONS.map((option) => (
                  <NativeSelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </NativeSelect>
            </Stack>
          ) : null}
        </Stack>

        <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
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
