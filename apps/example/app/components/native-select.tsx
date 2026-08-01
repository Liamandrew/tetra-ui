import {
  NativeSelect,
  NativeSelectItem,
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
  const [menuValue, setMenuValue] = useState("1");
  const [wheelValue, setWheelValue] = useState("2");
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <NativeSelectPreview />
      </ScreenHero>

      <ScreenHero className="items-stretch bg-background">
        <Stack className="w-full" gap="md">
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
                onValueChange={setWheelValue}
                value={wheelValue}
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
