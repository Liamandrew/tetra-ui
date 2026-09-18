import { useState } from "react";
import { View } from "react-native";
import { ScrimPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";
import { Button, ButtonText } from "@/components/ui/button";
import { Scrim, ScrimHost, ScrimTarget } from "@/components/ui/scrim";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export default function ScrimScreen() {
  const [open, setOpen] = useState(false);

  return (
    <ScreenScrollView>
      <ScreenHero>
        <ScrimPreview />
      </ScreenHero>

      <ScreenHero className="bg-background p-0">
        <ScrimHost className="w-full">
          <ScrimTarget>
            <Stack className="flex-1 items-center justify-center p-4" gap="md">
              <Text className="text-center text-muted-foreground">
                Content behind the overlay stays in place and blurs when the
                scrim is open.
              </Text>
              <Button onPress={() => setOpen(true)}>
                <ButtonText>Show scrim</ButtonText>
              </Button>
            </Stack>
          </ScrimTarget>
          <Scrim onPress={() => setOpen(false)} open={open} />
          {open ? (
            <View className="absolute inset-x-8 top-1/3 z-50 rounded-2xl bg-card p-4">
              <Stack gap="md">
                <Text className="font-medium">Behind the menu</Text>
                <Text className="text-muted-foreground">
                  Tap the scrim to dismiss.
                </Text>
              </Stack>
            </View>
          ) : null}
        </ScrimHost>
      </ScreenHero>
    </ScreenScrollView>
  );
}
