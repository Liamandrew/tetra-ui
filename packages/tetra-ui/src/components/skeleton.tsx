import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

// Types
type SkeletonProps = React.ComponentProps<typeof Animated.View> & {
  duration?: number;
  minOpacity?: number;
  maxOpacity?: number;
};

// Components
export const Skeleton = ({
  className,
  duration = 1000,
  minOpacity = 0.4,
  maxOpacity = 1,
  ...props
}: SkeletonProps) => {
  const opacity = useSharedValue(minOpacity);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(maxOpacity, { duration }), -1, true);
  }, [duration, maxOpacity, opacity]);

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
