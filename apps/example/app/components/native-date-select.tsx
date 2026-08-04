import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import { InputAddon } from "@repo/tetra-ui/components/input";
import { Label } from "@repo/tetra-ui/components/label";
import {
  NativeDateSelect,
  NativeDateSelectContent,
  NativeDateSelectInput,
  NativeDateSelectSheetConfirm,
  NativeDateSelectSheetFooter,
  NativeDateSelectTrigger,
} from "@repo/tetra-ui/components/native-date-select";
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

export default function NativeDateSelectScreen() {
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());
  const [dateTimeValue, setDateTimeValue] = useState(new Date());
  const [confirmValue, setConfirmValue] = useState(new Date());
  const [compactInputValue, setCompactInputValue] = useState(new Date());
  const [customValue, setCustomValue] = useState(new Date());
  const [compactValue, setCompactValue] = useState(new Date());
  const [graphicalValue, setGraphicalValue] = useState(new Date());
  const [wheelValue, setWheelValue] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date>();
  const [rangeEnd, setRangeEnd] = useState<Date>();
  const [showDisabled, setShowDisabled] = useState(false);

  const customLabel = customValue.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <Stack className="w-full" gap="md">
          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Input — date</Text>
            <NativeDateSelect
              disabled={showDisabled}
              mode="date"
              onValueChange={setDateValue}
              value={dateValue}
            >
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="Pick a date" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
          </Stack>

          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Input — time</Text>
            <NativeDateSelect
              disabled={showDisabled}
              mode="time"
              onValueChange={setTimeValue}
              value={timeValue}
            >
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="Pick a time" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
          </Stack>

          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">
              Input — datetime
            </Text>
            <NativeDateSelect
              disabled={showDisabled}
              mode="datetime"
              onValueChange={setDateTimeValue}
              value={dateTimeValue}
            >
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="Pick date & time" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
          </Stack>

          {Platform.OS === "ios" ? (
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">
                Input — compact
              </Text>
              <NativeDateSelect
                disabled={showDisabled}
                mode="date"
                onValueChange={setCompactInputValue}
                value={compactInputValue}
              >
                <NativeDateSelectInput
                  placeholder="Pick a date"
                  variant="compact"
                >
                  <InputAddon align="inline-start">
                    <Label>Date</Label>
                  </InputAddon>
                </NativeDateSelectInput>
                <NativeDateSelectContent />
              </NativeDateSelect>
            </Stack>
          ) : null}

          {Platform.OS === "ios" ? (
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">
                Input — date with confirm
              </Text>
              <NativeDateSelect
                disabled={showDisabled}
                mode="date"
                onValueChange={setConfirmValue}
                value={confirmValue}
              >
                <NativeDateSelectTrigger asChild>
                  <NativeDateSelectInput placeholder="Pick with confirm..." />
                </NativeDateSelectTrigger>
                <NativeDateSelectContent>
                  <NativeDateSelectSheetFooter>
                    <NativeDateSelectSheetConfirm asChild>
                      <Button>Confirm</Button>
                    </NativeDateSelectSheetConfirm>
                  </NativeDateSelectSheetFooter>
                </NativeDateSelectContent>
              </NativeDateSelect>
            </Stack>
          ) : null}

          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">
              Custom trigger
            </Text>
            <NativeDateSelect
              disabled={showDisabled}
              mode="date"
              onValueChange={setCustomValue}
              value={customValue}
            >
              <NativeDateSelectTrigger asChild>
                <Button className="w-fit" size="sm" variant="secondary">
                  <ButtonText>{customLabel}</ButtonText>
                </Button>
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
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

      {Platform.OS === "ios" ? (
        <ScreenHero className="items-stretch bg-background">
          <Stack className="w-full" gap="md">
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">Compact</Text>
              <NativeDateSelect
                disabled={showDisabled}
                mode="date"
                onValueChange={setCompactValue}
                value={compactValue}
                variant="compact"
              >
                <NativeDateSelectContent />
              </NativeDateSelect>
            </Stack>

            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">Graphical</Text>
              <NativeDateSelect
                disabled={showDisabled}
                mode="date"
                onValueChange={setGraphicalValue}
                value={graphicalValue}
                variant="graphical"
              >
                <NativeDateSelectContent />
              </NativeDateSelect>
            </Stack>

            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">Wheel</Text>
              <NativeDateSelect
                disabled={showDisabled}
                mode="date"
                onValueChange={setWheelValue}
                value={wheelValue}
                variant="wheel"
              >
                <NativeDateSelectContent />
              </NativeDateSelect>
            </Stack>
          </Stack>
        </ScreenHero>
      ) : (
        <ScreenHero className="items-stretch bg-background">
          <Stack className="w-full" gap="md">
            <Stack gap="xs">
              <Text className="text-muted-foreground text-sm">Date</Text>
              <NativeDateSelect
                disabled={showDisabled}
                mode="date"
                onValueChange={setGraphicalValue}
                value={graphicalValue}
              >
                <NativeDateSelectContent />
              </NativeDateSelect>
            </Stack>
          </Stack>
        </ScreenHero>
      )}

      <ScreenHero className="items-stretch bg-background">
        <Stack className="w-full" gap="md">
          <Stack gap="xs">
            <Text className="text-muted-foreground text-sm">Range</Text>
            <NativeDateSelect
              disabled={showDisabled}
              maximumDate={rangeEnd}
              mode="date"
              onValueChange={setRangeStart}
              value={rangeStart}
            >
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="Start date" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
            <NativeDateSelect
              disabled={showDisabled}
              minimumDate={rangeStart}
              mode="date"
              onValueChange={setRangeEnd}
              value={rangeEnd}
            >
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="End date" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
          </Stack>
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
