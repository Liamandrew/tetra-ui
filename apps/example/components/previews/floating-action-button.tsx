import { View } from "react-native";
import {
  Fab,
  FabHost,
  FabIcon,
  FabText,
} from "@/components/ui/floating-action-button";
import { PlusIcon } from "@/components/ui/icons";

export function FloatingActionButtonPreview() {
  return (
    <View className="h-56 w-full">
      <FabHost>
        <Fab accessibilityLabel="Create" appearance="extended">
          <FabIcon>
            <PlusIcon />
          </FabIcon>
          <FabText>Create</FabText>
        </Fab>
      </FabHost>
    </View>
  );
}
