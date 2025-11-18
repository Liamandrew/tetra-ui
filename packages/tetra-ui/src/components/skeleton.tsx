import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

// Constants
const ANIMATION_DURATION = 1000;
const MIN_OPACITY = 0.4;
const MAX_OPACITY = 1;

// Types
type SkeletonProps = React.ComponentProps<typeof Animated.View>;

// Components
export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  const opacity = useSharedValue(MIN_OPACITY);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(MAX_OPACITY, { duration: ANIMATION_DURATION }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      className={cn("w-full rounded-md bg-accent", className)}
      data-slot="skeleton"
      style={animatedStyle}
      {...props}
    />
  );
};
