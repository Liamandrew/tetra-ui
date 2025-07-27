import { ScrollView } from "react-native";

export const ScreenScrollView = (
  props: React.ComponentProps<typeof ScrollView>
) => {
  return (
    <ScrollView
      className="bg-background-muted py-4"
      contentContainerClassName="flex gap-4"
      contentInsetAdjustmentBehavior="automatic"
      {...props}
    />
  );
};
