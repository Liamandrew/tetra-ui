import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckboxInput } from "@/components/ui/checkbox";
import {
  NativeSheet,
  NativeSheetBody,
  NativeSheetContent,
  NativeSheetFooter,
  NativeSheetHeader,
  NativeSheetModal,
  NativeSheetOverlay,
  NativeSheetTitle,
  NativeSheetTrigger,
} from "@/components/ui/native-sheet";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function NativeSheetPreview() {
  return (
    <Stack gap="md">
      <SettingsSheetExample />

      <ConfirmationSheetExample />

      <ContentDisplaySheetExample />

      <CustomOverlaySheetExample />
    </Stack>
  );
}

function SettingsSheetExample() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <NativeSheet onOpenChange={setOpen} open={open}>
      <NativeSheetTrigger asChild>
        <Button>Open Settings</Button>
      </NativeSheetTrigger>
      <NativeSheetModal>
        <NativeSheetOverlay />
        <NativeSheetContent>
          <NativeSheetHeader>
            <NativeSheetTitle>Settings</NativeSheetTitle>
          </NativeSheetHeader>
          <NativeSheetBody>
            <Stack gap="md">
              <CheckboxInput
                checked={notifications}
                onPress={() => setNotifications(!notifications)}
              >
                Enable push notifications
              </CheckboxInput>
              <CheckboxInput
                checked={emailUpdates}
                onPress={() => setEmailUpdates(!emailUpdates)}
              >
                Receive email updates
              </CheckboxInput>
              <Separator />
              <CheckboxInput
                checked={darkMode}
                onPress={() => setDarkMode(!darkMode)}
              >
                Dark mode
              </CheckboxInput>
            </Stack>
          </NativeSheetBody>
          <NativeSheetFooter>
            <Button className="flex-1" onPress={() => setOpen(false)}>
              Save Changes
            </Button>
          </NativeSheetFooter>
        </NativeSheetContent>
      </NativeSheetModal>
    </NativeSheet>
  );
}

function ConfirmationSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <NativeSheet onOpenChange={setOpen} open={open}>
      <NativeSheetTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </NativeSheetTrigger>
      <NativeSheetModal>
        <NativeSheetOverlay />
        <NativeSheetContent>
          <NativeSheetHeader>
            <NativeSheetTitle>Confirm Deletion</NativeSheetTitle>
          </NativeSheetHeader>
          <NativeSheetBody>
            <Text>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </Text>
          </NativeSheetBody>
          <NativeSheetFooter>
            <Stack className="w-full" direction="row" gap="sm">
              <Button
                className="flex-1"
                onPress={() => setOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onPress={() => {
                  setOpen(false);
                }}
                variant="destructive"
              >
                Delete
              </Button>
            </Stack>
          </NativeSheetFooter>
        </NativeSheetContent>
      </NativeSheetModal>
    </NativeSheet>
  );
}

function ContentDisplaySheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <NativeSheet onOpenChange={setOpen} open={open}>
      <NativeSheetTrigger asChild>
        <Button variant="outline">View Details</Button>
      </NativeSheetTrigger>
      <NativeSheetModal>
        <NativeSheetOverlay />
        <NativeSheetContent>
          <NativeSheetHeader>
            <NativeSheetTitle>Project Details</NativeSheetTitle>
          </NativeSheetHeader>
          <NativeSheetBody>
            <Stack gap="md">
              <Card>
                <CardHeader>
                  <Stack className="items-center" direction="row" gap="sm">
                    <CardTitle>Tetra UI</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </Stack>
                  <CardDescription>
                    A modern UI component library for React Native
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack gap="sm">
                    <Text className="text-muted-foreground">
                      Built with TypeScript and designed for cross-platform
                      development. Includes a comprehensive set of accessible
                      components.
                    </Text>
                    <Stack direction="row" gap="sm">
                      <Badge variant="outline">React Native</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                      <Badge variant="outline">Expo</Badge>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </NativeSheetBody>
          <NativeSheetFooter>
            <Button className="w-full" onPress={() => setOpen(false)}>
              Close
            </Button>
          </NativeSheetFooter>
        </NativeSheetContent>
      </NativeSheetModal>
    </NativeSheet>
  );
}

function CustomOverlaySheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <NativeSheet onOpenChange={setOpen} open={open}>
      <NativeSheetTrigger asChild>
        <Button variant="ghost">Custom Overlay</Button>
      </NativeSheetTrigger>
      <NativeSheetModal>
        <NativeSheetOverlay className="bg-red-500" closeOnPress={false} />
        <NativeSheetContent>
          <NativeSheetHeader>
            <NativeSheetTitle>Custom Overlay</NativeSheetTitle>
          </NativeSheetHeader>
          <NativeSheetBody>
            <Stack gap="md">
              <Text>
                This is a custom overlay with a red background and no close on
                press
              </Text>
            </Stack>
          </NativeSheetBody>
          <NativeSheetFooter>
            <Button className="w-full" onPress={() => setOpen(false)}>
              Close
            </Button>
          </NativeSheetFooter>
        </NativeSheetContent>
      </NativeSheetModal>
    </NativeSheet>
  );
}
