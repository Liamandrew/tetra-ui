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
        <Text className="font-medium text-foreground">Message from Expo</Text>
        <Text className="mt-1 text-muted-foreground text-sm">
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
