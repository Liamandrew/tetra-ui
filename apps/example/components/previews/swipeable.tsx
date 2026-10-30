import {
  Swipeable,
  SwipeableAction,
  SwipeableActionGroup,
  SwipeableContent,
} from "@/components/ui/swipeable";
import { Text } from "@/components/ui/text";

export function SwipeablePreview() {
  return (
    <Swipeable>
      <SwipeableContent className="px-4 py-4">
        <Text className="text-foreground font-medium">Message from Expo</Text>
        <Text className="text-muted-foreground mt-1 text-sm">
          Swipe for actions
        </Text>
      </SwipeableContent>
      <SwipeableActionGroup edge="trailing">
        <SwipeableAction variant="secondary">Archive</SwipeableAction>
        <SwipeableAction variant="destructive">Delete</SwipeableAction>
      </SwipeableActionGroup>
    </Swipeable>
  );
}
