import { BlurTargetView, BlurView } from "expo-blur";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AccessibilityInfo, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useUniwind } from "uniwind";
import { cn } from "@/registry/lib/utils";

// Constants
const ANIMATION_DURATION = 250;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const OVERLAY_OPACITY = { dark: 0.72, light: 0.25 } as const;
const DEFAULT_INTENSITY = 32;
const ENTERING = FadeIn.duration(ANIMATION_DURATION).easing(ANIMATION_EASING);
const EXITING = FadeOut.duration(ANIMATION_DURATION).easing(ANIMATION_EASING);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Types
type ScrimContextValue = {
  blurTarget: React.RefObject<View | null>;
};

type ScrimTint = "dark" | "light";

type ScrimChrome = {
  blurTarget?: React.RefObject<View | null>;
  overlayOpacity: number;
  showBlur: boolean;
  showDim: boolean;
  tint: ScrimTint;
};

export type ScrimHostProps = React.ComponentProps<typeof View>;

export type ScrimTargetProps = React.ComponentProps<typeof View>;

export type ScrimProps = Omit<
  React.ComponentProps<typeof Pressable>,
  "children"
> & {
  open?: boolean;
  closeOnPress?: boolean;
  intensity?: number;
  overlayOpacity?: number;
  visibilityProgress?: SharedValue<number>;
};

type OpenDrivenScrimProps = Omit<ScrimProps, "visibilityProgress">;

type ProgressDrivenScrimProps = Omit<ScrimProps, "visibilityProgress"> & {
  visibilityProgress: SharedValue<number>;
};

// Context
const ScrimContext = createContext<ScrimContextValue | null>(null);

const useOptionalScrimContext = () => {
  return useContext(ScrimContext);
};

export const useScrim = () => {
  const context = useContext(ScrimContext);
  if (!context) {
    throw new Error("useScrim must be used within a ScrimHost");
  }
  return context;
};

const usePrefersReducedTransparency = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setEnabled);

    const subscription = AccessibilityInfo.addEventListener(
      "reduceTransparencyChanged",
      setEnabled
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return enabled;
};

const useScrimChrome = (
  overlayOpacityProp: number | undefined,
  intensity: number
): ScrimChrome => {
  const context = useOptionalScrimContext();
  const { theme } = useUniwind();
  const prefersReducedTransparency = usePrefersReducedTransparency();
  const overlayOpacity =
    overlayOpacityProp ??
    (theme === "dark" ? OVERLAY_OPACITY.dark : OVERLAY_OPACITY.light);

  return {
    blurTarget: context?.blurTarget,
    overlayOpacity,
    showBlur: intensity > 0 && !prefersReducedTransparency,
    showDim: overlayOpacity > 0,
    tint: theme === "dark" ? "dark" : "light",
  };
};

// Components
export const ScrimHost = ({
  className,
  children,
  ...props
}: ScrimHostProps) => {
  const blurTarget = useRef<View>(null);
  const ctx = useMemo(() => ({ blurTarget }), []);

  return (
    <ScrimContext.Provider value={ctx}>
      <View className={cn("relative flex-1", className)} {...props}>
        {children}
      </View>
    </ScrimContext.Provider>
  );
};

export const ScrimTarget = ({
  className,
  children,
  ...props
}: ScrimTargetProps) => {
  const context = useOptionalScrimContext();

  return (
    <BlurTargetView
      className={cn("relative flex-1", className)}
      collapsable={false}
      ref={context?.blurTarget}
      {...props}
    >
      {children}
    </BlurTargetView>
  );
};

const ScrimDim = ({ opacity }: { opacity: number }) => {
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: "black", opacity }]}
    />
  );
};

const OpenDrivenScrim = ({
  open = false,
  closeOnPress = true,
  intensity = DEFAULT_INTENSITY,
  overlayOpacity: overlayOpacityProp,
  onPress,
  className,
  accessibilityLabel = "Dismiss",
  disabled,
  style,
  ...props
}: OpenDrivenScrimProps) => {
  const skipEnterOnMount = useRef(open);
  const { blurTarget, overlayOpacity, showBlur, showDim, tint } =
    useScrimChrome(overlayOpacityProp, intensity);
  const canPress = closeOnPress && Boolean(onPress);

  useEffect(() => {
    skipEnterOnMount.current = false;
  }, []);

  if (!open) {
    return null;
  }

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      className={cn("absolute inset-0 z-40", className)}
      disabled={disabled ?? !canPress}
      entering={skipEnterOnMount.current ? undefined : ENTERING}
      exiting={EXITING}
      onPress={onPress}
      {...props}
      style={style}
    >
      {showBlur ? (
        <BlurView
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTarget}
          intensity={intensity}
          style={StyleSheet.absoluteFill}
          tint={tint}
        />
      ) : null}
      {showDim ? <ScrimDim opacity={overlayOpacity} /> : null}
    </AnimatedPressable>
  );
};

const ProgressDrivenScrim = ({
  open = false,
  closeOnPress = true,
  intensity = DEFAULT_INTENSITY,
  overlayOpacity: overlayOpacityProp,
  visibilityProgress,
  onPress,
  className,
  accessibilityLabel = "Dismiss",
  disabled,
  style,
  ...props
}: ProgressDrivenScrimProps) => {
  const [mounted, setMounted] = useState(open);
  const { blurTarget, overlayOpacity, showBlur, showDim, tint } =
    useScrimChrome(overlayOpacityProp, intensity);
  const canPress = closeOnPress && Boolean(onPress);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    const timeout = setTimeout(() => {
      setMounted(false);
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  const blurAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(
        visibilityProgress.value,
        [0, 1],
        [0, intensity],
        Extrapolation.CLAMP
      ),
    };
  });

  const dimAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        visibilityProgress.value,
        [0, 1],
        [0, overlayOpacity],
        Extrapolation.CLAMP
      ),
    };
  });

  if (!mounted) {
    return null;
  }

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      className={cn("absolute inset-0 z-40", className)}
      disabled={disabled ?? !canPress}
      onPress={onPress}
      {...props}
      style={style}
    >
      {showBlur ? (
        <AnimatedBlurView
          animatedProps={blurAnimatedProps}
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTarget}
          intensity={intensity}
          style={StyleSheet.absoluteFill}
          tint={tint}
        />
      ) : null}
      {showDim ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "black" },
            dimAnimatedStyle,
          ]}
        />
      ) : null}
    </AnimatedPressable>
  );
};

export const Scrim = ({ visibilityProgress, ...props }: ScrimProps) => {
  if (visibilityProgress) {
    return (
      <ProgressDrivenScrim visibilityProgress={visibilityProgress} {...props} />
    );
  }

  return <OpenDrivenScrim {...props} />;
};
