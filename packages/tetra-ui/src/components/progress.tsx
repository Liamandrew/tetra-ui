import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext, useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Text } from "./text";

// Constants
const ANIMATION_DURATION = 320;
const ANIMATION_EASING = Easing.out(Easing.cubic);

// Types
type ProgressContextValue = VariantProps<typeof progressVariants> & {
  value: number;
  max: number;
};

type ProgressProps = React.ComponentProps<typeof View> &
  VariantProps<typeof progressVariants> & {
    value?: number | null;
    max?: number;
  };

// Context
const ProgressContext = createContext<ProgressContextValue | null>(null);

const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("Progress components must be used within Progress");
  }
  return context;
};

export function Progress({
  className,
  children,
  value,
  max = 100,
  variant = "linear",
  ...props
}: ProgressProps) {
  const normalizedValue = value ?? 0;

  const ctx = useMemo(
    () => ({
      max,
      value: normalizedValue,
      variant,
    }),
    [max, normalizedValue, variant]
  );

  return (
    <ProgressContext.Provider value={ctx}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{
          max,
          min: 0,
          now: normalizedValue,
        }}
        className={cn("flex w-full flex-wrap gap-3", className)}
        data-slot="progress"
        {...props}
      >
        {children}
        {variant === "steps" ? (
          <ProgressSteps />
        ) : (
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        )}
      </View>
    </ProgressContext.Provider>
  );
}

function ProgressTrack({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        progressVariants({ variant: "linear" }),
        "relative w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      style={{ borderCurve: "continuous" }}
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: React.ComponentProps<typeof Animated.View>) {
  const { max, value } = useProgress();
  const targetProgress = max > 0 ? value / max : 0;
  const fillProgress = useSharedValue(targetProgress);

  useEffect(() => {
    fillProgress.value = withTiming(targetProgress, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [fillProgress, targetProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillProgress.value * 100}%`,
  }));

  return (
    <Animated.View
      className={cn("h-full bg-primary", className)}
      data-slot="progress-indicator"
      style={[fillStyle, { borderCurve: "continuous" }]}
      {...props}
    />
  );
}

function ProgressSteps({ className }: { className?: string }) {
  const { max, value } = useProgress();
  const stepCount = Math.max(1, Math.round(max));
  const clampedValue = Math.max(0, Math.min(value, max));
  const fullSteps = Math.floor(clampedValue);
  const partialStepFill = clampedValue - fullSteps;

  const steps = useMemo(
    () =>
      Array.from({ length: stepCount }, (_, stepIndex) => {
        const stepNumber = stepIndex + 1;
        let fill = 0;

        if (stepIndex < fullSteps) {
          fill = 1;
        } else if (stepIndex === fullSteps) {
          fill = partialStepFill;
        }

        return { fill, stepNumber };
      }),
    [fullSteps, partialStepFill, stepCount]
  );

  return (
    <View
      className={cn(
        progressVariants({ variant: "steps" }),
        "w-full flex-row gap-1",
        className
      )}
      data-slot="progress-track"
    >
      {steps.map((step) => (
        <ProgressStep fill={step.fill} key={step.stepNumber} />
      ))}
    </View>
  );
}

function ProgressStep({ fill }: { fill: number }) {
  const fillProgress = useSharedValue(fill);

  useEffect(() => {
    fillProgress.value = withTiming(fill, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [fill, fillProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillProgress.value * 100}%`,
  }));

  return (
    <View
      className="relative h-full flex-1 overflow-hidden rounded-full bg-muted"
      data-slot="progress-step"
      style={{ borderCurve: "continuous" }}
    >
      <Animated.View
        className="h-full bg-primary"
        data-slot="progress-indicator"
        style={[fillStyle, { borderCurve: "continuous" }]}
      />
    </View>
  );
}

export function ProgressLabel({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("font-medium text-sm", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

export function ProgressValue({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { max, value } = useProgress();
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <Text
      className={cn(
        "ml-auto text-muted-foreground text-sm tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    >
      {percent}%
    </Text>
  );
}

// Styles
export const progressVariants = cva("h-1.5 w-full flex-row gap-1", {
  defaultVariants: {
    variant: "linear",
  },
  variants: {
    variant: {
      linear: "",
      steps: "",
    },
  },
});
