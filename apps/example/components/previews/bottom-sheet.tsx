import { useState } from "react";
import { View } from "react-native";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetOverlay,
  BottomSheetPortal,
  BottomSheetScrollView,
  BottomSheetTitle,
  BottomSheetTrigger,
  useBottomSheetInputHandlers,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { CheckboxInput } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/text-input";

export function BottomSheetPreview() {
  return (
    <Stack gap="md">
      <BasicSheetExample />
      <SnapPointsSheetExample />
      <ScrollableSheetExample />
      <KeyboardSheetExample />
      <CustomOverlaySheetExample />
    </Stack>
  );
}

function BasicSheetExample() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button>Open Settings</Button>
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Settings</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className="pb-4">
            <Stack gap="md">
              <Text className="text-muted-foreground">
                Dynamic sizing adjusts the sheet height to its content.
              </Text>
              <CheckboxInput
                checked={notifications}
                onPress={() => setNotifications(!notifications)}
              >
                <Text>Enable notifications</Text>
              </CheckboxInput>
            </Stack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onPress={() => setOpen(false)}>Done</Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

function SnapPointsSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="secondary">Snap Points</Button>
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent defaultSnapIndex={1} snapPoints={[0.35, 0.65, 1]}>
          <BottomSheetHeader>
            <BottomSheetTitle>Drag to resize</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody>
            <Text className="text-muted-foreground">
              Drag the handle to snap between 35%, 65%, and full height. Pan
              down to dismiss.
            </Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onPress={() => setOpen(false)}>Close</Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

function ScrollableSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="outline">Scrollable list</Button>
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent defaultSnapIndex={0} snapPoints={[0.5, 0.9]}>
          <BottomSheetHeader>
            <BottomSheetTitle>Notifications</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetScrollView className="flex-1">
            {Array.from({ length: 24 }, (_, index) => (
              <View
                className="border-border border-b py-3"
                key={index.toString()}
              >
                <Text className="font-medium">Notification {index + 1}</Text>
                <Text className="text-muted-foreground text-sm">
                  Swipe and scroll without fighting the sheet gesture.
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

function KeyboardSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="secondary">Keyboard</Button>
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent defaultSnapIndex={0} snapPoints={[0.45, 0.92]}>
          <KeyboardSheetForm onClose={() => setOpen(false)} />
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

function KeyboardSheetForm({ onClose }: { onClose: () => void }) {
  const inputHandlers = useBottomSheetInputHandlers();

  return (
    <>
      <BottomSheetHeader>
        <BottomSheetTitle>Send a message</BottomSheetTitle>
      </BottomSheetHeader>
      <BottomSheetScrollView className="flex-1">
        <Stack gap="md">
          <Stack gap="xs">
            <Label>Name</Label>
            <TextInput
              onBlur={inputHandlers.onBlur}
              onFocus={inputHandlers.onFocus}
              placeholder="Your name"
            />
          </Stack>
          <Stack gap="xs">
            <Label>Message</Label>
            <TextInput
              multiline
              onBlur={inputHandlers.onBlur}
              onFocus={inputHandlers.onFocus}
              placeholder="Type a message..."
            />
          </Stack>
        </Stack>
      </BottomSheetScrollView>
      <BottomSheetFooter>
        <Button onPress={onClose}>Send</Button>
      </BottomSheetFooter>
    </>
  );
}

function CustomOverlaySheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="destructive">Custom overlay</Button>
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay className="bg-red-500/30" closeOnPress={false} />
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Custom overlay</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className="pb-4">
            <Text className="text-muted-foreground">
              Overlay uses a custom tint and does not close on backdrop press.
              Use the header close button or pan down to dismiss.
            </Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onPress={() => setOpen(false)}>Got it</Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}
