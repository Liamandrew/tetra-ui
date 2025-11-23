import { Badge } from "@repo/tetra-ui/components/badge";
import { Button } from "@repo/tetra-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/tetra-ui/components/card";
import { CheckboxInput } from "@repo/tetra-ui/components/checkbox";
import {
  NativeSheet,
  NativeSheetBody,
  NativeSheetContent,
  NativeSheetFooter,
  NativeSheetHeader,
  NativeSheetTitle,
  NativeSheetTrigger,
} from "@repo/tetra-ui/components/native-sheet";
import { Separator } from "@repo/tetra-ui/components/separator";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function NativeSheetScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>NativeSheet</ScreenHeading>

      <Section title="Settings Sheet">
        <SettingsSheetExample />
      </Section>

      <Section title="Confirmation Sheet">
        <ConfirmationSheetExample />
      </Section>

      <Section title="Content Display Sheet">
        <ContentDisplaySheetExample />
      </Section>
    </ScreenScrollView>
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
                // Handle deletion
                setOpen(false);
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </Stack>
        </NativeSheetFooter>
      </NativeSheetContent>
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
    </NativeSheet>
  );
}
