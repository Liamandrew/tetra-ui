import { Heading } from "@repo/tetra-ui/components/heading";
import { View } from "react-native";

export const ScreenHeading = (props: React.PropsWithChildren) => {
  return (
    <View className="bg-background p-4">
      <Heading level="1" {...props} />
    </View>
  );
};
