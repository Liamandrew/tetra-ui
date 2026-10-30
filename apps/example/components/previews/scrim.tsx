import { View } from "react-native";
import { Scrim, ScrimHost, ScrimTarget } from "@/components/ui/scrim";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function ScrimPreview() {
  return (
    <View className="border-border h-56 w-full overflow-hidden rounded-xl border">
      <ScrimHost>
        <ScrimTarget>
          <Stack className="bg-background flex-1 p-4" gap="sm">
            <Text className="font-medium">Inbox</Text>
            <Text className="text-muted-foreground">Design review</Text>
            <Text className="text-muted-foreground">Weekly sync</Text>
            <Text className="text-muted-foreground">Release notes</Text>
          </Stack>
        </ScrimTarget>
        <Scrim open />
      </ScrimHost>
    </View>
  );
}
