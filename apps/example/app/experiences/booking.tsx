import { ActionInput } from "@repo/tetra-ui/components/action-input";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@repo/tetra-ui/components/alert";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/tetra-ui/components/card";
import { Heading } from "@repo/tetra-ui/components/heading";
import { CircleCheckIcon, InfoIcon } from "@repo/tetra-ui/components/icons";
import { Label } from "@repo/tetra-ui/components/label";
import {
  NativeDateSelect,
  NativeDateSelectContent,
  NativeDateSelectInput,
  NativeDateSelectTrigger,
} from "@repo/tetra-ui/components/native-date-select";
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
import { Slider } from "@repo/tetra-ui/components/slider";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { TextareaInput } from "@repo/tetra-ui/components/textarea-input";
import { toast } from "@repo/tetra-ui/components/toast";
import { Stack as RouterStack } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { DemoHint } from "@/components/demo-hint";
import { ScreenScrollView } from "@/components/screen";

const SEATING = [
  { label: "Indoor", value: "indoor" },
  { label: "Patio", value: "patio" },
  { label: "Bar", value: "bar" },
];

export default function BookingExperience() {
  const [date, setDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 2);
    next.setHours(19, 0, 0, 0);
    return next;
  });
  const [time, setTime] = useState(() => {
    const next = new Date();
    next.setHours(19, 0, 0, 0);
    return next;
  });
  const [partySize, setPartySize] = useState(2);
  const [seating, setSeating] = useState("indoor");
  const [notes, setNotes] = useState("");
  const [occasionOpen, setOccasionOpen] = useState(false);
  const [occasion, setOccasion] = useState<string>();
  const [showMissing, setShowMissing] = useState(false);

  const occasionLabel = useMemo(() => {
    switch (occasion) {
      case "birthday":
        return "Birthday";
      case "anniversary":
        return "Anniversary";
      case "business":
        return "Business dinner";
      case "none":
        return "No special occasion";
      default:
        return;
    }
  }, [occasion]);

  const dateLabel = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    weekday: "short",
    year: "numeric",
  });
  const timeLabel = time.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const confirm = () => {
    if (!occasion) {
      setShowMissing(true);
      return;
    }

    setShowMissing(false);
    toast.success("Reservation requested", {
      description: `${partySize} guests · ${dateLabel} at ${timeLabel} · ${occasionLabel}`,
    });
  };

  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Booking" }} />
      <ScreenScrollView contentContainerClassName="p-4 pb-8">
        <Stack className="w-full" gap="lg">
          <Stack gap="xs">
            <Heading level="2">Reserve a table</Heading>
            <Text className="text-muted-foreground">
              Pick a date, time, and seating preference for Harbor Room.
            </Text>
          </Stack>

          <Card>
            <CardHeader>
              <CardTitle>Harbor Room</CardTitle>
              <CardDescription>
                Seasonal plates · waterfront · walk-ins welcome until 6pm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground text-sm">
                214 Pier Avenue · Open Tue–Sun
              </Text>
            </CardContent>
          </Card>

          {showMissing ? (
            <Alert variant="warning">
              <AlertIcon>
                <InfoIcon />
              </AlertIcon>
              <AlertTitle>Occasion required</AlertTitle>
              <AlertDescription>
                Choose an occasion so the kitchen can prepare.
              </AlertDescription>
            </Alert>
          ) : null}

          <Stack gap="xs">
            <Label>Date</Label>
            <NativeDateSelect mode="date" onValueChange={setDate} value={date}>
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="Pick a date" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
          </Stack>

          <Stack gap="xs">
            <Label>Time</Label>
            <NativeDateSelect mode="time" onValueChange={setTime} value={time}>
              <NativeDateSelectTrigger asChild>
                <NativeDateSelectInput placeholder="Pick a time" />
              </NativeDateSelectTrigger>
              <NativeDateSelectContent />
            </NativeDateSelect>
          </Stack>

          <Stack gap="sm">
            <Stack className="items-center justify-between" direction="row">
              <Label>Party size</Label>
              <Text className="font-medium text-sm">
                {Math.round(partySize)}
              </Text>
            </Stack>
            <View className="h-10 justify-center">
              <Slider
                max={12}
                min={1}
                onValueChange={setPartySize}
                step={1}
                value={partySize}
              />
            </View>
          </Stack>

          <Stack gap="sm">
            <Label>Seating</Label>
            <SegmentedControl onValueChange={setSeating} value={seating}>
              {SEATING.map((item) => (
                <SegmentedControlItem key={item.value} value={item.value}>
                  <SegmentedControlItemLabel>
                    {item.label}
                  </SegmentedControlItemLabel>
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </Stack>

          <Stack gap="xs">
            <Label>Occasion</Label>
            <ActionInput
              onPress={() => setOccasionOpen(true)}
              placeholder="Select an occasion"
              value={occasionLabel}
            />
          </Stack>

          <Stack gap="xs">
            <Label>Notes</Label>
            <TextareaInput
              onChangeText={setNotes}
              placeholder="Allergies, high chair, or timing requests"
              value={notes}
            />
          </Stack>

          <Alert variant="info">
            <AlertIcon>
              <CircleCheckIcon />
            </AlertIcon>
            <AlertTitle>Hold for 15 minutes</AlertTitle>
            <AlertDescription>
              We&apos;ll hold your table while you make your way over. No
              payment required today.
            </AlertDescription>
          </Alert>

          <Stack className="items-center" direction="row" gap="sm">
            <Button className="flex-1" onPress={confirm}>
              <ButtonText>Request reservation</ButtonText>
            </Button>
            <DemoHint>
              Confirming shows a success toast — nothing is sent to a server.
            </DemoHint>
          </Stack>
        </Stack>
      </ScreenScrollView>

      <BottomSheet onOpenChange={setOccasionOpen} open={occasionOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Occasion</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className="gap-3 pb-2">
            <Text className="text-muted-foreground text-sm">
              Helps the team prep the right table setup.
            </Text>
            <NativeSelect
              onValueChange={(value) => {
                setOccasion(value);
                setShowMissing(false);
              }}
              value={occasion ?? "none"}
            >
              <NativeSelectTrigger asChild>
                <NativeSelectInput placeholder="Select an occasion" />
              </NativeSelectTrigger>
              <NativeSelectContent>
                <NativeSelectItem label="Birthday" value="birthday" />
                <NativeSelectItem label="Anniversary" value="anniversary" />
                <NativeSelectItem label="Business dinner" value="business" />
                <NativeSelectItem label="No special occasion" value="none" />
              </NativeSelectContent>
            </NativeSelect>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button
              onPress={() => {
                if (!occasion) {
                  setOccasion("none");
                }
                setOccasionOpen(false);
                setShowMissing(false);
              }}
            >
              <ButtonText>Done</ButtonText>
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
}
