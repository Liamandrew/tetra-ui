import {
  BellIcon,
  BookOpenIcon,
  ChevronRightIcon,
  MailIcon,
  MoonIcon,
  ShieldIcon,
  ShoppingCartIcon,
} from "@repo/tetra-ui/components/icons";
import {
  InlineList,
  InlineListItem,
  InlineListItemAddon,
  InlineListItemAddonIcon,
  InlineListItemDescription,
  InlineListItemTitle,
} from "@repo/tetra-ui/components/inline-list";
import { Radio } from "@repo/tetra-ui/components/radio";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Switch } from "@repo/tetra-ui/components/switch";
import { useState } from "react";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

const handlePress = () => {
  return;
};

export default function InlineListScreen() {
  const [network, setNetwork] = useState("wifi");
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [badges, setBadges] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScreenScrollView>
      <ScreenHero>
        <Stack className="w-full" gap="lg">
          <InlineList title="Account">
            <InlineListItem onPress={handlePress}>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <MailIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Personal Info</InlineListItemTitle>
              <InlineListItemDescription>
                Name, email, phone number
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <InlineListItemAddonIcon>
                  <ChevronRightIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem onPress={handlePress}>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <ShoppingCartIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Orders</InlineListItemTitle>
              <InlineListItemDescription>
                View history and track shipments
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <InlineListItemAddonIcon>
                  <ChevronRightIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
            </InlineListItem>
          </InlineList>

          <InlineList title="Sign In & Security">
            <InlineListItem onPress={handlePress}>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <ShieldIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Security</InlineListItemTitle>
              <InlineListItemDescription>
                Password, 2FA
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <InlineListItemAddonIcon>
                  <ChevronRightIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem onPress={handlePress}>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <BookOpenIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Privacy</InlineListItemTitle>
              <InlineListItemDescription>
                Data sharing and permissions
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <InlineListItemAddonIcon>
                  <ChevronRightIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
            </InlineListItem>

            <InlineListItem onPress={handlePress} variant="destructive">
              <InlineListItemTitle>Delete Account</InlineListItemTitle>
            </InlineListItem>
          </InlineList>
        </Stack>
      </ScreenHero>

      <ScreenHero>
        <Stack className="w-full" gap="lg">
          <InlineList title="Network">
            <InlineListItem
              accessibilityRole="radio"
              accessibilityState={{ selected: network === "wifi" }}
              onPress={() => setNetwork("wifi")}
            >
              <InlineListItemTitle>Wi-Fi</InlineListItemTitle>
              <InlineListItemAddon align="inline-end">
                <Radio checked={network === "wifi"} />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem
              accessibilityRole="radio"
              accessibilityState={{ selected: network === "cellular" }}
              onPress={() => setNetwork("cellular")}
            >
              <InlineListItemTitle>Cellular</InlineListItemTitle>
              <InlineListItemAddon align="inline-end">
                <Radio checked={network === "cellular"} />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem
              accessibilityRole="radio"
              accessibilityState={{ selected: network === "offline" }}
              onPress={() => setNetwork("offline")}
            >
              <InlineListItemTitle>Offline Mode</InlineListItemTitle>
              <InlineListItemAddon align="inline-end">
                <Radio checked={network === "offline"} />
              </InlineListItemAddon>
            </InlineListItem>
          </InlineList>

          <InlineList title="Preferences">
            <InlineListItem>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <BellIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Notifications</InlineListItemTitle>
              <InlineListItemAddon align="inline-end">
                <Switch
                  onValueChange={setNotifications}
                  value={notifications}
                />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem>
              <InlineListItemTitle>Sounds</InlineListItemTitle>
              <InlineListItemDescription>
                Alerts and ringtones
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <Switch onValueChange={setSounds} value={sounds} />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem>
              <InlineListItemTitle>Badges</InlineListItemTitle>
              <InlineListItemDescription>
                Show unread counts
              </InlineListItemDescription>
              <InlineListItemAddon align="inline-end">
                <Switch onValueChange={setBadges} value={badges} />
              </InlineListItemAddon>
            </InlineListItem>
            <InlineListItem>
              <InlineListItemAddon align="inline-start">
                <InlineListItemAddonIcon>
                  <MoonIcon />
                </InlineListItemAddonIcon>
              </InlineListItemAddon>
              <InlineListItemTitle>Dark Mode</InlineListItemTitle>
              <InlineListItemAddon align="inline-end">
                <Switch onValueChange={setDarkMode} value={darkMode} />
              </InlineListItemAddon>
            </InlineListItem>
          </InlineList>
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
