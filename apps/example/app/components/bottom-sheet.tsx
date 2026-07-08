import { useState } from "react";
import { BottomSheetPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/text-input";

export default function BottomSheetScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <Stack gap="md">
          <BottomSheetPreview />
          <SnapPointsSheetExample />
          <FullOnlySheetExample />
          <ScrollableSheetExample />
          <KeyboardSheetExample />
          <NoDragHandleSheetExample />
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}

function SnapPointsSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="secondary">Snap Points</Button>
      </BottomSheetTrigger>
      <BottomSheetContent snapPoints={[{ fraction: 1 / 3 }, "half", "full"]}>
        <BottomSheetHeader>
          <BottomSheetTitle>Drag to resize</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetBody className="gap-2">
          <Text className="text-muted-foreground">
            Drag the handle to snap between half and full height. Swipe down to
            dismiss.
          </Text>

          <Text className="text-muted-foreground">
            iOS supports multiple detents. On Android, fractional and height
            snap points map to the nearest partial or expanded state.
          </Text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

function FullOnlySheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="secondary">Full only</Button>
      </BottomSheetTrigger>
      <BottomSheetContent snapPoints={["full"]}>
        <BottomSheetHeader>
          <BottomSheetTitle>Full height</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetBody>
          <Text className="text-muted-foreground">
            Opens fully expanded with no partial stop. On Android this uses
            skipPartiallyExpanded.
          </Text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

function ScrollableSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="outline">Scrollable list</Button>
      </BottomSheetTrigger>
      <BottomSheetContent snapPoints={["half", "full"]}>
        <BottomSheetHeader>
          <BottomSheetTitle>Notifications</BottomSheetTitle>
        </BottomSheetHeader>

        <BottomSheetScrollView>
          {DATA.map((item, index) => (
            <Text className="py-4" key={index.toString()}>
              {item}
            </Text>
          ))}
        </BottomSheetScrollView>
      </BottomSheetContent>
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
      <BottomSheetContent snapPoints={["half", "full"]}>
        <BottomSheetHeader>
          <BottomSheetTitle>Send a message</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetScrollView>
          <Stack gap="md">
            <Stack gap="xs">
              <Label>Name</Label>
              <TextInput placeholder="Your name" />
            </Stack>
            <Stack gap="xs">
              <Label>Message</Label>
              <TextInput multiline placeholder="Type a message..." />
            </Stack>
          </Stack>
        </BottomSheetScrollView>
        <BottomSheetFooter>
          <Button onPress={() => setOpen(false)}>Send</Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

function NoDragHandleSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button variant="destructive">No drag handle</Button>
      </BottomSheetTrigger>
      <BottomSheetContent showDragIndicator={false}>
        <BottomSheetHeader>
          <BottomSheetTitle>Hidden handle</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetBody className="pb-4">
          <Text className="text-muted-foreground">
            The drag handle is hidden. Content should not clip against the top
            edge of the sheet.
          </Text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button onPress={() => setOpen(false)}>Got it</Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
