import { createContext, useContext, useEffect, useMemo } from "react";
import Animated, {
  type SharedValue,
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
type InternalSkeletonGroupContextType = {
  opacity: SharedValue<number>;
};

type SkeletonGroupProps = {
  children: React.ReactNode;
};

type SkeletonProps = React.ComponentProps<typeof Animated.View>;

// Context
const SkeletonGroupContext =
  createContext<InternalSkeletonGroupContextType | null>(null);

const useSkeletonGroupContext = () => useContext(SkeletonGroupContext);

// Components
export const SkeletonGroup = ({ children }: SkeletonGroupProps) => {
  const opacity = useSharedValue(MIN_OPACITY);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(MAX_OPACITY, { duration: ANIMATION_DURATION }),
      -1,
      true
    );
  }, [opacity]);

  const ctx = useMemo(() => {
    return {
      opacity,
    };
  }, [opacity]);

  return (
    <SkeletonGroupContext.Provider value={ctx}>
      {children}
    </SkeletonGroupContext.Provider>
  );
};

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  const groupContext = useSkeletonGroupContext();
  const localOpacity = useSharedValue(MIN_OPACITY);
  const opacity = groupContext?.opacity ?? localOpacity;

  useEffect(() => {
    if (groupContext) {
      return;
    }

    localOpacity.value = withRepeat(
      withTiming(MAX_OPACITY, { duration: ANIMATION_DURATION }),
      -1,
      true
    );
  }, [groupContext, localOpacity]);

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
