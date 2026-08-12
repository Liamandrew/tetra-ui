import { Avatar, AvatarFallback } from "@repo/tetra-ui/components/avatar";
import { Badge, BadgeText } from "@repo/tetra-ui/components/badge";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@repo/tetra-ui/components/bottom-sheet";
import {
  Button,
  ButtonIcon,
  ButtonText,
} from "@repo/tetra-ui/components/button";
import { Chip, ChipText } from "@repo/tetra-ui/components/chip";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyMediaIcon,
  EmptyTitle,
} from "@repo/tetra-ui/components/empty";
import {
  ArchiveIcon,
  EllipsisVerticalIcon,
  MailIcon,
  TrashIcon,
  XIcon,
} from "@repo/tetra-ui/components/icons";
import {
  InputAddon,
  InputAddonButton,
  InputAddonButtonIcon,
} from "@repo/tetra-ui/components/input";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuTrigger,
} from "@repo/tetra-ui/components/menu";
import { SearchInput } from "@repo/tetra-ui/components/search-input";
import { Skeleton, SkeletonGroup } from "@repo/tetra-ui/components/skeleton";
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
import { toast } from "@repo/tetra-ui/components/toast";
import { Stack as RouterStack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { ScreenScrollView } from "@/components/screen";

type Message = {
  id: string;
  from: string;
  initials: string;
  preview: string;
  subject: string;
  unread: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    from: "Maya Chen",
    id: "1",
    initials: "MC",
    preview:
      "The new experiences section looks polished — shipping notes attached.",
    subject: "tetra-ui experiences review",
    unread: true,
  },
  {
    from: "Jordan Blake",
    id: "2",
    initials: "JB",
    preview: "Can we move the standup to 10:30? Calendar invite updated.",
    subject: "Standup time change",
    unread: true,
  },
  {
    from: "Harbor Room",
    id: "3",
    initials: "HR",
    preview: "Your table for 4 is confirmed for Friday at 7:00 PM.",
    subject: "Reservation confirmed",
    unread: false,
  },
  {
    from: "Design Systems",
    id: "4",
    initials: "DS",
    preview: "Weekly digest: 12 components updated, 3 new docs pages.",
    subject: "Weekly component digest",
    unread: false,
  },
  {
    from: "Sam Ortiz",
    id: "5",
    initials: "SO",
    preview: "Thanks for the OTP flow walkthrough — works great on device.",
    subject: "Re: Sign-in flow feedback",
    unread: true,
  },
];

type Filter = "all" | "unread";

const SKELETON_ROWS = ["a", "b", "c", "d"] as const;

export default function InboxExperience() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, []);

  const visibleMessages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return messages.filter((message) => {
      if (filter === "unread" && !message.unread) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        message.from.toLowerCase().includes(normalized) ||
        message.subject.toLowerCase().includes(normalized) ||
        message.preview.toLowerCase().includes(normalized)
      );
    });
  }, [filter, messages, query]);

  const unreadCount = messages.filter((message) => message.unread).length;

  const archiveMessage = (id: string) => {
    const message = messages.find((item) => item.id === id);
    setMessages((current) => current.filter((item) => item.id !== id));
    toast.success("Archived", {
      description: message?.subject,
    });
  };

  const deleteMessage = (id: string) => {
    const message = messages.find((item) => item.id === id);
    setMessages((current) => current.filter((item) => item.id !== id));
    toast("Deleted", {
      description: message?.subject,
    });
  };

  const markRead = (id: string) => {
    setMessages((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
    toast.info("Marked as read");
  };

  const muteSender = (from: string) => {
    toast.warning(`Muted ${from}`, {
      description: "You won't get alerts from this sender.",
    });
  };

  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Inbox" }} />
      <ScreenScrollView contentContainerClassName="pb-8">
        <Stack className="w-full" gap="md">
          <Stack className="px-4 pt-2" gap="md">
            <Stack className="items-center" direction="row" gap="sm">
              <SearchInput
                className="flex-1"
                onChangeText={setQuery}
                placeholder="Search messages"
                value={query}
              >
                {query ? (
                  <InputAddon align="inline-end">
                    <InputAddonButton
                      className="size-7"
                      onPress={() => setQuery("")}
                      variant="link"
                    >
                      <InputAddonButtonIcon>
                        <XIcon />
                      </InputAddonButtonIcon>
                    </InputAddonButton>
                  </InputAddon>
                ) : null}
              </SearchInput>

              <BottomSheet onOpenChange={setFiltersOpen} open={filtersOpen}>
                <BottomSheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <ButtonIcon>
                      <EllipsisVerticalIcon />
                    </ButtonIcon>
                  </Button>
                </BottomSheetTrigger>
                <BottomSheetContent>
                  <BottomSheetHeader>
                    <BottomSheetTitle>Inbox filters</BottomSheetTitle>
                  </BottomSheetHeader>
                  <BottomSheetBody className="gap-3 pb-2">
                    <Text className="text-muted-foreground text-sm">
                      Narrow the list without leaving your inbox.
                    </Text>
                    <Stack direction="row" gap="sm">
                      <Chip
                        onPress={() => setFilter("all")}
                        variant={filter === "all" ? "default" : "outline"}
                      >
                        <ChipText>All</ChipText>
                      </Chip>
                      <Chip
                        onPress={() => setFilter("unread")}
                        variant={filter === "unread" ? "default" : "outline"}
                      >
                        <ChipText>Unread</ChipText>
                      </Chip>
                    </Stack>
                  </BottomSheetBody>
                  <BottomSheetFooter>
                    <Button onPress={() => setFiltersOpen(false)}>
                      <ButtonText>Done</ButtonText>
                    </Button>
                  </BottomSheetFooter>
                </BottomSheetContent>
              </BottomSheet>
            </Stack>

            <Stack direction="row" gap="sm">
              <Chip
                onPress={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
              >
                <ChipText>All</ChipText>
              </Chip>
              <Chip
                onPress={() => setFilter("unread")}
                variant={filter === "unread" ? "default" : "outline"}
              >
                <ChipText>
                  Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
                </ChipText>
              </Chip>
            </Stack>
          </Stack>

          {loading ? (
            <SkeletonGroup>
              <Stack className="px-4" gap="md">
                {SKELETON_ROWS.map((rowId) => (
                  <Stack
                    className="items-start"
                    direction="row"
                    gap="sm"
                    key={rowId}
                  >
                    <Skeleton className="size-10 rounded-full" />
                    <Stack className="flex-1" gap="xs">
                      <Skeleton className="h-4 w-1/3 rounded-md" />
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                      <Skeleton className="h-3 w-full rounded-md" />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </SkeletonGroup>
          ) : null}

          {!loading && visibleMessages.length === 0 ? (
            <View className="px-4 pt-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <EmptyMediaIcon>
                      <MailIcon />
                    </EmptyMediaIcon>
                  </EmptyMedia>
                  <EmptyTitle>No messages</EmptyTitle>
                  <EmptyDescription>
                    Try a different search or clear the unread filter.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onPress={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                    size="sm"
                  >
                    <ButtonText>Reset filters</ButtonText>
                  </Button>
                </EmptyContent>
              </Empty>
            </View>
          ) : null}

          {!loading && visibleMessages.length > 0 ? (
            <SwipeableList>
              {visibleMessages.map((message) => (
                <Swipeable key={message.id}>
                  <SwipeableContent
                    className="px-4 py-3 active:bg-muted/60"
                    onPress={() => markRead(message.id)}
                  >
                    <Stack className="items-start" direction="row" gap="sm">
                      <Avatar className="mt-1" size="sm">
                        <AvatarFallback>{message.initials}</AvatarFallback>
                      </Avatar>
                      <Stack className="min-w-0 flex-1" gap="xs">
                        <Stack
                          className="items-center justify-between"
                          direction="row"
                          gap="sm"
                        >
                          <Text
                            className={
                              message.unread
                                ? "font-semibold text-foreground"
                                : "font-medium text-foreground"
                            }
                          >
                            {message.from}
                          </Text>
                          <Menu>
                            <MenuTrigger>
                              <Button size="icon-sm" variant="ghost">
                                <ButtonIcon>
                                  <EllipsisVerticalIcon />
                                </ButtonIcon>
                              </Button>
                            </MenuTrigger>
                            <MenuContent>
                              <MenuItem onPress={() => markRead(message.id)}>
                                <MenuItemIcon
                                  icon={Platform.select({
                                    android: require("@expo/material-symbols/mark_email_read.xml"),
                                    ios: "envelope.open",
                                  })}
                                />
                                <MenuItemLabel>Mark as read</MenuItemLabel>
                              </MenuItem>
                              <MenuItem
                                onPress={() => muteSender(message.from)}
                              >
                                <MenuItemIcon
                                  icon={Platform.select({
                                    android: require("@expo/material-symbols/notifications_off.xml"),
                                    ios: "bell.slash",
                                  })}
                                />
                                <MenuItemLabel>Mute sender</MenuItemLabel>
                              </MenuItem>
                            </MenuContent>
                          </Menu>
                        </Stack>
                        <Stack
                          className="items-center"
                          direction="row"
                          gap="sm"
                        >
                          <Text
                            className="flex-1 text-foreground text-sm"
                            numberOfLines={1}
                          >
                            {message.subject}
                          </Text>
                          {message.unread ? (
                            <Badge>
                              <BadgeText>New</BadgeText>
                            </Badge>
                          ) : null}
                        </Stack>
                        <Text
                          className="text-muted-foreground text-sm"
                          numberOfLines={2}
                        >
                          {message.preview}
                        </Text>
                      </Stack>
                    </Stack>
                  </SwipeableContent>
                  <SwipeableActionGroup edge="trailing">
                    <SwipeableAction
                      accessibilityLabel="Archive"
                      onPress={() => archiveMessage(message.id)}
                      variant="secondary"
                    >
                      <SwipeableActionIcon>
                        <ArchiveIcon />
                      </SwipeableActionIcon>
                    </SwipeableAction>
                    <SwipeableAction
                      accessibilityLabel="Delete"
                      onPress={() => deleteMessage(message.id)}
                      variant="destructive"
                    >
                      <SwipeableActionIcon>
                        <TrashIcon />
                      </SwipeableActionIcon>
                    </SwipeableAction>
                  </SwipeableActionGroup>
                </Swipeable>
              ))}
            </SwipeableList>
          ) : null}
        </Stack>
      </ScreenScrollView>
    </>
  );
}
