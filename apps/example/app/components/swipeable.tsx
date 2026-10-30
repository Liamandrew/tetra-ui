import {
  ArchiveIcon,
  BellIcon,
  MailIcon,
  PinIcon,
  TrashIcon,
} from "@repo/tetra-ui/components/icons";
import {
  InlineList,
  InlineListItem,
  InlineListItemAddon,
  InlineListItemAddonIcon,
  InlineListItemDescription,
  InlineListItemTitle,
} from "@repo/tetra-ui/components/inline-list";
import { Stack } from "@repo/tetra-ui/components/stack";
import {
  Swipeable,
  SwipeableAction,
  SwipeableActionGroup,
  SwipeableActionIcon,
  SwipeableContent,
  SwipeableList,
} from "@repo/tetra-ui/components/swipeable";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import { Alert, View } from "react-native";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function SwipeableScreen() {
  const [pinned, setPinned] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const openItem = (title: string) => {
    Alert.alert("Pressed", title);
  };

  return (
    <ScreenScrollView>
      <ScreenHero className="px-0">
        <Stack className="w-full" gap="md">
          <Text className="text-foreground px-4 font-medium">Examples</Text>
          <SwipeableList>
            <Stack className="w-full" gap="none">
              <Swipeable>
                <SwipeableContent
                  className="active:bg-muted/60 px-4 py-3"
                  onPress={() =>
                    openItem(pinned ? "Review PR (Pinned)" : "Review PR")
                  }
                >
                  <Text className="text-foreground font-medium">
                    {pinned ? "Review PR (Pinned)" : "Review PR"}
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-sm">
                    Both edges · text · pin leading · archive / delete trailing
                  </Text>
                </SwipeableContent>
                <SwipeableActionGroup edge="leading">
                  <SwipeableAction
                    onPress={() => setPinned((current) => !current)}
                  >
                    Pin
                  </SwipeableAction>
                </SwipeableActionGroup>
                <SwipeableActionGroup edge="trailing">
                  <SwipeableAction
                    onPress={() => Alert.alert("Archived", "PR archived.")}
                    variant="secondary"
                  >
                    Archive
                  </SwipeableAction>
                  <SwipeableAction
                    onPress={() => Alert.alert("Deleted", "PR deleted.")}
                    variant="destructive"
                  >
                    Delete
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>

              <Swipeable>
                <SwipeableContent
                  className="active:bg-muted/60 px-4 py-3"
                  onPress={() => openItem("invoice-march.pdf")}
                >
                  <Text className="text-foreground font-medium">
                    invoice-march.pdf
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-sm">
                    Trailing only · single delete · full swipe commits
                  </Text>
                </SwipeableContent>
                <SwipeableActionGroup edge="trailing">
                  <SwipeableAction
                    onPress={() =>
                      Alert.alert("Deleted", "invoice-march.pdf deleted.")
                    }
                    variant="destructive"
                  >
                    Delete
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>

              <Swipeable>
                <SwipeableContent
                  className="active:bg-muted/60 px-4 py-3"
                  onPress={() =>
                    openItem(
                      reminderEnabled
                        ? "Reminders enabled"
                        : "Reminders disabled"
                    )
                  }
                >
                  <View className="flex-row items-center gap-3">
                    <BellIcon className="text-foreground size-5" />
                    <View className="min-w-0 flex-1">
                      <Text className="text-foreground font-medium">
                        {reminderEnabled
                          ? "Reminders enabled"
                          : "Reminders disabled"}
                      </Text>
                      <Text className="text-muted-foreground mt-1 text-sm">
                        Leading only · full swipe toggles
                      </Text>
                    </View>
                  </View>
                </SwipeableContent>
                <SwipeableActionGroup edge="leading">
                  <SwipeableAction
                    onPress={() => setReminderEnabled((current) => !current)}
                    variant="secondary"
                  >
                    {reminderEnabled ? "Disable" : "Enable"}
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>

              <Swipeable>
                <SwipeableContent
                  className="active:bg-muted/60 px-4 py-3"
                  onPress={() => openItem("Trailing icons")}
                >
                  <Text className="text-foreground font-medium">
                    Trailing icons
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-sm">
                    Icons only · archive / delete · full swipe runs delete
                  </Text>
                </SwipeableContent>
                <SwipeableActionGroup edge="trailing">
                  <SwipeableAction
                    accessibilityLabel="Archive"
                    onPress={() => Alert.alert("Archived", "Item archived.")}
                    variant="secondary"
                  >
                    <SwipeableActionIcon>
                      <ArchiveIcon />
                    </SwipeableActionIcon>
                  </SwipeableAction>
                  <SwipeableAction
                    accessibilityLabel="Delete"
                    onPress={() => Alert.alert("Deleted", "Item deleted.")}
                    variant="destructive"
                  >
                    <SwipeableActionIcon>
                      <TrashIcon />
                    </SwipeableActionIcon>
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>

              <Swipeable>
                <SwipeableContent
                  className="active:bg-muted/60 px-4 py-3"
                  onPress={() => openItem("Pin and archive")}
                >
                  <Text className="text-foreground font-medium">
                    Pin and archive
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-sm">
                    Icons · leading pin (full swipe) · trailing archive (no full
                    swipe)
                  </Text>
                </SwipeableContent>
                <SwipeableActionGroup edge="leading">
                  <SwipeableAction
                    accessibilityLabel="Pin"
                    onPress={() => Alert.alert("Pinned", "Item pinned.")}
                  >
                    <SwipeableActionIcon>
                      <PinIcon />
                    </SwipeableActionIcon>
                  </SwipeableAction>
                </SwipeableActionGroup>
                <SwipeableActionGroup allowsFullSwipe={false} edge="trailing">
                  <SwipeableAction
                    accessibilityLabel="Archive"
                    onPress={() => Alert.alert("Archived", "Item archived.")}
                    variant="secondary"
                  >
                    <SwipeableActionIcon>
                      <ArchiveIcon />
                    </SwipeableActionIcon>
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>

              <Swipeable>
                <SwipeableContent
                  className="active:bg-muted/60 px-4 py-3"
                  onPress={() => openItem("Labeled actions")}
                >
                  <Text className="text-foreground font-medium">
                    Labeled actions
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-sm">
                    Icon + text · trailing archive / delete
                  </Text>
                </SwipeableContent>
                <SwipeableActionGroup edge="trailing">
                  <SwipeableAction
                    onPress={() => Alert.alert("Archived", "Item archived.")}
                    variant="secondary"
                  >
                    <SwipeableActionIcon>
                      <ArchiveIcon />
                    </SwipeableActionIcon>
                    Archive
                  </SwipeableAction>
                  <SwipeableAction
                    onPress={() => Alert.alert("Deleted", "Item deleted.")}
                    variant="destructive"
                  >
                    <SwipeableActionIcon>
                      <TrashIcon />
                    </SwipeableActionIcon>
                    Delete
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>
            </Stack>
          </SwipeableList>
        </Stack>
      </ScreenHero>

      <ScreenHero>
        <Stack className="w-full" gap="md">
          <Text className="text-foreground px-1 font-medium">
            With InlineList
          </Text>
          <SwipeableList>
            <InlineList title="Mail">
              <Swipeable>
                <SwipeableContent onPress={() => openItem("Unread thread")}>
                  <InlineListItem>
                    <InlineListItemAddon align="inline-start">
                      <InlineListItemAddonIcon>
                        <MailIcon />
                      </InlineListItemAddonIcon>
                    </InlineListItemAddon>
                    <InlineListItemTitle>Unread thread</InlineListItemTitle>
                    <InlineListItemDescription>
                      Trailing archive
                    </InlineListItemDescription>
                  </InlineListItem>
                </SwipeableContent>
                <SwipeableActionGroup edge="trailing">
                  <SwipeableAction
                    onPress={() => Alert.alert("Archived", "Thread archived.")}
                    variant="secondary"
                  >
                    Archive
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>
              <Swipeable>
                <SwipeableContent onPress={() => openItem("Design feedback")}>
                  <InlineListItem>
                    <InlineListItemAddon align="inline-start">
                      <InlineListItemAddonIcon>
                        <MailIcon />
                      </InlineListItemAddonIcon>
                    </InlineListItemAddon>
                    <InlineListItemTitle>Design feedback</InlineListItemTitle>
                    <InlineListItemDescription>
                      Leading pin · trailing delete
                    </InlineListItemDescription>
                  </InlineListItem>
                </SwipeableContent>
                <SwipeableActionGroup edge="leading">
                  <SwipeableAction
                    onPress={() => Alert.alert("Pinned", "Thread pinned.")}
                  >
                    Pin
                  </SwipeableAction>
                </SwipeableActionGroup>
                <SwipeableActionGroup edge="trailing">
                  <SwipeableAction
                    onPress={() => Alert.alert("Deleted", "Thread deleted.")}
                    variant="destructive"
                  >
                    Delete
                  </SwipeableAction>
                </SwipeableActionGroup>
              </Swipeable>
            </InlineList>
          </SwipeableList>
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
