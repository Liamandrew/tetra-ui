import { useState } from "react";
import { ScreenHero, ScreenScrollView } from "@/components/screen";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Fab,
  type FabAppearance,
  type FabEdge,
  FabHost,
  FabIcon,
  FabMenu,
  FabMenuItem,
  FabMenuItemIcon,
  FabMenuItemLabel,
  type FabProps,
  FabText,
} from "@/components/ui/floating-action-button";
import {
  BookOpenIcon,
  CalendarPlusIcon,
  MailIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemLabel,
} from "@/components/ui/segmented-control";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/text-input";
import { toast } from "@/components/ui/toast";

type FabSize = NonNullable<FabProps["size"]>;
type FabDemoAction = "menu" | "sheet";

export default function FloatingActionButtonScreen() {
  const [action, setAction] = useState<FabDemoAction>("menu");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [edge, setEdge] = useState<FabEdge>("bottom-end");
  const [size, setSize] = useState<FabSize>("default");
  const [appearance, setAppearance] = useState<FabAppearance>("extended");

  return (
    <FabHost>
      <ScreenScrollView>
        <ScreenHero className="items-stretch px-4">
          <Stack gap="lg">
            <PropControl
              label="Action"
              onValueChange={(value) => {
                if (value === "menu" || value === "sheet") {
                  setAction(value);
                  setSheetOpen(false);
                }
              }}
              options={[
                { label: "Menu", value: "menu" },
                { label: "Sheet", value: "sheet" },
              ]}
              value={action}
            />

            <PropControl
              label="Placement"
              onValueChange={(value) => {
                if (
                  value === "bottom-end" ||
                  value === "bottom-start" ||
                  value === "bottom-center"
                ) {
                  setEdge(value);
                }
              }}
              options={[
                { label: "Start", value: "bottom-start" },
                { label: "Center", value: "bottom-center" },
                { label: "End", value: "bottom-end" },
              ]}
              value={edge}
            />

            <PropControl
              label="Size"
              onValueChange={(value) => {
                if (value === "sm" || value === "default" || value === "lg") {
                  setSize(value);
                }
              }}
              options={[
                { label: "Small", value: "sm" },
                { label: "Default", value: "default" },
                { label: "Large", value: "lg" },
              ]}
              value={size}
            />

            <PropControl
              label="Appearance"
              onValueChange={(value) => {
                if (
                  value === "fab" ||
                  value === "extended" ||
                  value === "auto"
                ) {
                  setAppearance(value);
                }
              }}
              options={[
                { label: "Icon", value: "fab" },
                { label: "Extended", value: "extended" },
                { label: "Auto", value: "auto" },
              ]}
              value={appearance}
            />
          </Stack>
        </ScreenHero>
      </ScreenScrollView>

      <Fab
        accessibilityLabel={action === "sheet" ? "New draft" : "Create"}
        appearance={appearance}
        edge={edge}
        onPress={
          action === "sheet"
            ? () => {
                setSheetOpen((current) => !current);
              }
            : undefined
        }
        open={action === "sheet" ? sheetOpen : undefined}
        size={size}
      >
        <FabIcon>
          <PlusIcon />
        </FabIcon>
        <FabText>Create</FabText>
        {action === "menu" ? (
          <FabMenu>
            <FabMenuItem key="note" onPress={() => toast("Note created")}>
              <FabMenuItemIcon>
                <BookOpenIcon />
              </FabMenuItemIcon>
              <FabMenuItemLabel>Note</FabMenuItemLabel>
            </FabMenuItem>
            <FabMenuItem key="event" onPress={() => toast("Event created")}>
              <FabMenuItemIcon>
                <CalendarPlusIcon />
              </FabMenuItemIcon>
              <FabMenuItemLabel>Event</FabMenuItemLabel>
            </FabMenuItem>
            <FabMenuItem key="mail" onPress={() => toast("Mail drafted")}>
              <FabMenuItemIcon>
                <MailIcon />
              </FabMenuItemIcon>
              <FabMenuItemLabel>Mail</FabMenuItemLabel>
            </FabMenuItem>
            <FabMenuItem
              key="delete"
              onPress={() => toast("Deleted")}
              variant="destructive"
            >
              <FabMenuItemIcon>
                <TrashIcon />
              </FabMenuItemIcon>
              <FabMenuItemLabel>Delete</FabMenuItemLabel>
            </FabMenuItem>
          </FabMenu>
        ) : null}
      </Fab>

      {action === "sheet" ? (
        <DraftSheet onOpenChange={setSheetOpen} open={sheetOpen} />
      ) : null}
    </FabHost>
  );
}

const PropControl = ({
  label,
  description,
  value,
  onValueChange,
  options,
}: {
  label: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}) => {
  return (
    <Stack gap="sm">
      <Label>{label}</Label>
      <SegmentedControl onValueChange={onValueChange} value={value}>
        {options.map((option) => (
          <SegmentedControlItem key={option.value} value={option.value}>
            <SegmentedControlItemLabel>
              {option.label}
            </SegmentedControlItemLabel>
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      {description ? (
        <Text className="text-muted-foreground text-sm">{description}</Text>
      ) : null}
    </Stack>
  );
};

const DraftSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("note");

  return (
    <BottomSheet onOpenChange={onOpenChange} open={open}>
      <BottomSheetContent snapPoints={["half", "full"]}>
        <BottomSheetHeader>
          <BottomSheetTitle>New draft</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetBody className="pb-8">
          <Stack gap="md">
            <Stack gap="xs">
              <Label>Title</Label>
              <TextInput
                onChangeText={setTitle}
                placeholder="Weekly recap"
                value={title}
              />
            </Stack>
            <Stack gap="xs">
              <Label>Type</Label>
              <SegmentedControl onValueChange={setKind} value={kind}>
                <SegmentedControlItem value="note">
                  <SegmentedControlItemLabel>Note</SegmentedControlItemLabel>
                </SegmentedControlItem>
                <SegmentedControlItem value="event">
                  <SegmentedControlItemLabel>Event</SegmentedControlItemLabel>
                </SegmentedControlItem>
                <SegmentedControlItem value="mail">
                  <SegmentedControlItemLabel>Mail</SegmentedControlItemLabel>
                </SegmentedControlItem>
              </SegmentedControl>
            </Stack>
          </Stack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button
            onPress={() => {
              const label = title.trim() || "Untitled";
              toast(`Created ${kind}: ${label}`);
              setTitle("");
              onOpenChange(false);
            }}
          >
            <ButtonText>Create</ButtonText>
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};
