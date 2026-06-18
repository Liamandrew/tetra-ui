import {
  Button,
  ButtonIcon,
  ButtonText,
} from "@repo/tetra-ui/components/button";
import { XIcon } from "@repo/tetra-ui/components/icons";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { toast } from "@repo/tetra-ui/components/toast";
import { View } from "react-native";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

const showCustomToast = () => {
  const id = { current: "" as string | number };

  id.current = toast.custom(
    <View className="mx-4 flex-row items-center gap-3 rounded-xl border border-border bg-popover p-4">
      <View className="flex-1">
        <Text className="font-medium">Event has been created.</Text>
        <Text className="text-muted-foreground text-sm">
          Monday, January 3rd at 6:00pm
        </Text>
      </View>
      <Button
        onPress={() => toast.dismiss(id.current)}
        size="icon-sm"
        variant="ghost"
      >
        <ButtonIcon>
          <XIcon />
        </ButtonIcon>
      </Button>
    </View>,
    {
      duration: Number.POSITIVE_INFINITY,
    }
  );
};

export default function ToastScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero>
        <Stack className="w-full" gap="sm">
          <Button onPress={() => toast("Event has been created.")}>
            <ButtonText>Default</ButtonText>
          </Button>
          <Button onPress={() => toast.success("Event has been created.")}>
            <ButtonText>Success</ButtonText>
          </Button>
          <Button
            onPress={() =>
              toast.info("Be at the area 10 minutes before the event time.")
            }
          >
            <ButtonText>Info</ButtonText>
          </Button>
          <Button
            onPress={() =>
              toast.warning("Event start time cannot be earlier than 8am.")
            }
          >
            <ButtonText>Warning</ButtonText>
          </Button>
          <Button onPress={() => toast.error("Event has not been created.")}>
            <ButtonText>Error</ButtonText>
          </Button>
          <Button
            onPress={() =>
              toast("Event has been created.", {
                description: "Monday, January 3rd at 6:00pm",
              })
            }
          >
            <ButtonText>With description</ButtonText>
          </Button>
          <Button
            onPress={() =>
              toast.promise(
                new Promise((resolve) => {
                  setTimeout(resolve, 2000);
                }),
                {
                  loading: "Loading...",
                  success: () => "Data loaded",
                  error: "Failed to load data",
                }
              )
            }
          >
            <ButtonText>Promise</ButtonText>
          </Button>
        </Stack>
      </ScreenHero>

      <ScreenHero>
        <Stack className="w-full" gap="sm">
          <Button
            onPress={() =>
              toast("Event has been created.", { position: "top-center" })
            }
          >
            <ButtonText>Top center</ButtonText>
          </Button>
          <Button
            onPress={() =>
              toast("Event has been created.", { position: "bottom-center" })
            }
          >
            <ButtonText>Bottom center</ButtonText>
          </Button>
          <Button
            onPress={() =>
              toast("Event has been created.", { position: "center" })
            }
          >
            <ButtonText>Center</ButtonText>
          </Button>
        </Stack>
      </ScreenHero>

      <ScreenHero>
        <Stack className="w-full" gap="sm">
          <Button onPress={showCustomToast}>
            <ButtonText>Custom with close</ButtonText>
          </Button>
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
