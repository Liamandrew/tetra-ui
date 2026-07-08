import { useState } from "react";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { CheckboxInput } from "@/components/ui/checkbox";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function BottomSheetPreview() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <BottomSheet onOpenChange={setOpen} open={open}>
      <BottomSheetTrigger asChild>
        <Button>Open Settings</Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>Settings</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetBody className="pb-4">
          <Stack gap="md">
            <Text className="text-muted-foreground">
              Auto-sizes to content. No portal or overlay needed.
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
    </BottomSheet>
  );
}
