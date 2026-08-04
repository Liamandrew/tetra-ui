import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import { InputAddon } from "@repo/tetra-ui/components/input";
import { Label } from "@repo/tetra-ui/components/label";
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectInput,
  NativeSelectItem,
  NativeSelectSheetConfirm,
  NativeSelectSheetFooter,
  NativeSelectTrigger,
} from "@repo/tetra-ui/components/native-select";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import { Platform } from "react-native";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
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
  const [customValue, setCustomValue] = useState("1");
  const [menuValue, setMenuValue] = useState("1");
  const [standaloneWheelValue, setStandaloneWheelValue] = useState("2");
  const [showDisabled, setShowDisabled] = useState(false);

  const customLabel = OPTIONS.find(
    (option) => option.value === customValue
  )?.label;

  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <Stack className="w-full" gap="md">
          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Input — wheel</Text>
            <NativeSelect
              disabled={showDisabled}
              onValueChange={setWheelValue}
              value={wheelValue}
            >
              <NativeSelectTrigger asChild>
                <NativeSelectInput placeholder="Select..." />
              </NativeSelectTrigger>
              <NativeSelectContent>
                {OPTIONS.map((option) => (
                  <NativeSelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </NativeSelectContent>
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
                <NativeSelectTrigger asChild>
                  <NativeSelectInput placeholder="Select with confirm..." />
                </NativeSelectTrigger>
                <NativeSelectContent>
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
                </NativeSelectContent>
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
                <NativeSelectInput placeholder="Select..." variant="menu">
                  <InputAddon align="inline-start">
                    <Label>Choice</Label>
                  </InputAddon>
                </NativeSelectInput>
                <NativeSelectContent>
                  {OPTIONS.map((option) => (
                    <NativeSelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </NativeSelectContent>
              </NativeSelect>
            </Stack>
          ) : null}

          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">
              Custom trigger
            </Text>
            <NativeSelect
              disabled={showDisabled}
              onValueChange={setCustomValue}
              value={customValue}
            >
              <NativeSelectTrigger asChild>
                <Button className="w-fit" size="sm" variant="secondary">
                  <ButtonText>{customLabel ?? "Select"}</ButtonText>
                </Button>
              </NativeSelectTrigger>
              <NativeSelectContent>
                {OPTIONS.map((option) => (
                  <NativeSelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </NativeSelectContent>
            </NativeSelect>
          </Stack>
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

      <ScreenHero className="items-stretch bg-background">
        <Stack className="w-full" gap="md">
          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Menu</Text>
            <NativeSelect
              disabled={showDisabled}
              onValueChange={setMenuValue}
              value={menuValue}
              variant="menu"
            >
              <NativeSelectContent>
                {OPTIONS.map((option) => (
                  <NativeSelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </NativeSelectContent>
            </NativeSelect>
          </Stack>

          {Platform.OS === "ios" ? (
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">Wheel</Text>
              <NativeSelect
                disabled={showDisabled}
                onValueChange={setStandaloneWheelValue}
                value={standaloneWheelValue}
                variant="wheel"
              >
                <NativeSelectContent>
                  {OPTIONS.map((option) => (
                    <NativeSelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </NativeSelectContent>
              </NativeSelect>
            </Stack>
          ) : null}
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
