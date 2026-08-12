import {
  Accordion,
  AccordionContent,
  AccordionIndicator,
  AccordionItem,
  AccordionTrigger,
} from "@repo/tetra-ui/components/accordion";
import { Badge, BadgeText } from "@repo/tetra-ui/components/badge";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@repo/tetra-ui/components/bottom-sheet";
import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import {
  ChevronRightIcon,
  MailIcon,
  MoonIcon,
  ShieldIcon,
  SunIcon,
} from "@repo/tetra-ui/components/icons";
import {
  InlineList,
  InlineListItem,
  InlineListItemAddon,
  InlineListItemAddonIcon,
  InlineListItemDescription,
  InlineListItemTitle,
} from "@repo/tetra-ui/components/inline-list";
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectInput,
  NativeSelectItem,
  NativeSelectTrigger,
} from "@repo/tetra-ui/components/native-select";
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemLabel,
} from "@repo/tetra-ui/components/segmented-control";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Switch } from "@repo/tetra-ui/components/switch";
import { Text } from "@repo/tetra-ui/components/text";
import { Stack as RouterStack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";
import { DemoHint } from "@/components/demo-hint";
import { ScreenScrollView } from "@/components/screen";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
  { label: "Deutsch", value: "de" },
  { label: "日本語", value: "ja" },
];

export default function SettingsExperience() {
  const { theme } = useUniwind();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [language, setLanguage] = useState("en");
  const [languageOpen, setLanguageOpen] = useState(false);

  const languageLabel =
    LANGUAGES.find((item) => item.value === language)?.label ?? "English";

  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Settings" }} />
      <ScreenScrollView contentContainerClassName="p-4 pb-8">
        <Stack gap="lg">
          <InlineList title="Account">
            <InlineListItem>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <MailIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Alex Rivera</InlineListItemTitle>
              <InlineListItemDescription>
                alex@tetra-ui.com
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <Badge variant="secondary">
                  <BadgeText>Pro</BadgeText>
                </Badge>
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem onPress={() => setLanguageOpen(true)}>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <ShieldIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Language</InlineListItemTitle>
              <InlineListItemDescription>
                {languageLabel}
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <InlineListItemAddonIcon>
                  <ChevronRightIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
            </InlineListItem>
          </InlineList>

          <InlineList title="Notifications">
            <InlineListItem>
              <InlineListItemTitle>Push notifications</InlineListItemTitle>
              <InlineListItemDescription>
                Alerts for messages and activity
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <Switch onValueChange={setPushEnabled} value={pushEnabled} />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem>
              <InlineListItemTitle>Email digests</InlineListItemTitle>
              <InlineListItemDescription>
                Weekly summary of unread items
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <Switch onValueChange={setEmailEnabled} value={emailEnabled} />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem>
              <InlineListItemTitle>Product updates</InlineListItemTitle>
              <InlineListItemDescription>
                Tips and new feature announcements
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <Switch
                  onValueChange={setMarketingEnabled}
                  value={marketingEnabled}
                />
              </InlineListItemAddon>
            </InlineListItem>
          </InlineList>

          <Stack gap="sm">
            <Text className="px-1 font-medium text-muted-foreground text-sm">
              Appearance
            </Text>
            <SegmentedControl
              onValueChange={(value) => {
                if (value === "light" || value === "dark") {
                  Uniwind.setTheme(value);
                }
              }}
              value={theme === "dark" ? "dark" : "light"}
            >
              <SegmentedControlItem value="light">
                <SegmentedControlItemLabel>Light</SegmentedControlItemLabel>
              </SegmentedControlItem>
              <SegmentedControlItem value="dark">
                <SegmentedControlItemLabel>Dark</SegmentedControlItemLabel>
              </SegmentedControlItem>
            </SegmentedControl>
            <Stack className="items-center px-1" direction="row" gap="xs">
              {theme === "dark" ? (
                <MoonIcon className="size-4 text-muted-foreground" />
              ) : (
                <SunIcon className="size-4 text-muted-foreground" />
              )}
              <Text className="flex-1 text-muted-foreground text-sm">
                Applies across the app
              </Text>
              <DemoHint>
                Theme changes apply to the whole example app, including other
                experiences.
              </DemoHint>
            </Stack>
          </Stack>

          <Stack gap="sm">
            <Text className="px-1 font-medium text-muted-foreground text-sm">
              About
            </Text>
            <View className="w-full">
              <Accordion collapsible type="single">
                <AccordionItem value="privacy">
                  <AccordionTrigger>
                    <Text className="flex-1 font-medium text-foreground">
                      Privacy
                    </Text>
                    <AccordionIndicator />
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text className="text-muted-foreground text-sm">
                      Your preferences stay on this device. Nothing is sent to a
                      server.
                    </Text>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="version">
                  <AccordionTrigger>
                    <Text className="flex-1 font-medium text-foreground">
                      Version
                    </Text>
                    <AccordionIndicator />
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text className="text-muted-foreground text-sm">
                      Harbor · 1.0.0 (build 48)
                    </Text>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="support">
                  <AccordionTrigger>
                    <Text className="flex-1 font-medium text-foreground">
                      Support
                    </Text>
                    <AccordionIndicator />
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text className="text-muted-foreground text-sm">
                      Email support@harbor.app or open a chat from your account.
                    </Text>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </View>
          </Stack>
        </Stack>
      </ScreenScrollView>

      <BottomSheet onOpenChange={setLanguageOpen} open={languageOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Language</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className="gap-3 pb-2">
            <Text className="text-muted-foreground text-sm">
              Choose your preferred language.
            </Text>
            <NativeSelect onValueChange={setLanguage} value={language}>
              <NativeSelectTrigger asChild>
                <NativeSelectInput placeholder="Select a language" />
              </NativeSelectTrigger>
              <NativeSelectContent>
                {LANGUAGES.map((item) => (
                  <NativeSelectItem
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </NativeSelectContent>
            </NativeSelect>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onPress={() => setLanguageOpen(false)}>
              <ButtonText>Done</ButtonText>
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
}
