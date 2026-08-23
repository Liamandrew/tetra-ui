import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  AppState,
  type AppStateStatus,
  type LayoutChangeEvent,
  Pressable,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Button, ButtonIcon } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

// Constants
const DEFAULT_PER_VIEW = 1.2;
const DEFAULT_GAP = 12;
const DEFAULT_AUTOPLAY_INTERVAL = 4000;
const SNAP_SPRING = { damping: 22, mass: 0.45, stiffness: 420 };
const SNAP_TIMING_MS = 180;
const GESTURE_ACTIVE_OFFSET_X = 8;
const GESTURE_FAIL_OFFSET_Y = 24;
const VELOCITY_THRESHOLD = 250;
const RUBBER_BAND = 0.35;
const DOT_SIZE = 8;
const DOT_GROW = 10;

// Types
export type CarouselVariant = "page" | "inline";

export type CarouselRef = {
  scrollTo: (index: number, animated?: boolean) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
  getIndex: () => number;
};

export type CarouselApi = {
  index: number;
  count: number;
  looping: boolean;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollTo: (index: number, animated?: boolean) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
  progress: SharedValue<number>;
};

export type CarouselProps = Omit<React.ComponentProps<typeof View>, "ref"> & {
  variant?: CarouselVariant;
  perView?: number;
  gap?: number;
  inset?: number;
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  ref?: React.Ref<CarouselRef>;
};

type CarouselContextValue = {
  gap: number;
  itemWidth: number;
  count: number;
  index: number;
  looping: boolean;
  reduceMotion: boolean;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  progress: SharedValue<number>;
  translateX: SharedValue<number>;
  dragStartX: SharedValue<number>;
  strideSV: SharedValue<number>;
  countSV: SharedValue<number>;
  loopingSV: SharedValue<boolean>;
  cloneCountSV: SharedValue<number>;
  scrollTo: (index: number, animated?: boolean) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
  setCount: (count: number) => void;
  setContainerWidth: (width: number) => void;
  onPanStart: () => void;
  onSettledFromGesture: (visual: number) => void;
  reduceMotionSV: SharedValue<boolean>;
  cloneCount: number;
  peekInsetSV: SharedValue<number>;
};

// Utils
const clampIndex = (value: number, count: number) => {
  if (count <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), count - 1);
};

const canEnableLoop = (
  loop: boolean,
  variant: CarouselVariant,
  count: number,
  perView: number
) => {
  if (!loop || count < 2) {
    return false;
  }

  if (variant === "inline" && count <= perView) {
    return false;
  }

  return true;
};

const getTrackMetrics = (
  containerWidth: number,
  variant: CarouselVariant,
  perView: number,
  gap: number,
  inset: number
) => {
  const safeInset = Math.max(0, inset);
  const layoutWidth = Math.max(0, containerWidth - safeInset * 2);

  if (layoutWidth <= 0) {
    return { itemWidth: 0, peekInset: 0, stride: 0 };
  }

  if (variant === "page") {
    return {
      itemWidth: layoutWidth,
      peekInset: safeInset,
      stride: layoutWidth + gap,
    };
  }

  const views = Math.max(perView, 1);
  const itemWidth = (layoutWidth - gap * (views - 1)) / views;
  const fullItems = Math.max(1, Math.floor(perView));
  const packed = fullItems * itemWidth + Math.max(0, fullItems - 1) * gap;

  return {
    itemWidth,
    peekInset: safeInset + Math.max(0, (layoutWidth - packed) / 2),
    stride: itemWidth + gap,
  };
};

const offsetForVisual = (visual: number, stride: number, peekInset: number) => {
  "worklet";

  return -visual * stride + peekInset;
};

const visualForOffset = (offset: number, stride: number, peekInset: number) => {
  "worklet";

  if (stride === 0) {
    return 0;
  }

  return -(offset - peekInset) / stride;
};

const getLoopCloneCount = (
  looping: boolean,
  variant: CarouselVariant,
  perView: number,
  count: number
) => {
  if (!looping || count <= 0) {
    return 0;
  }

  if (variant === "page") {
    return 1;
  }

  return Math.min(count, Math.max(1, Math.ceil(perView)));
};

const getVisualIndex = (realIndex: number, cloneCount: number) => {
  return realIndex + cloneCount;
};

const getRealIndex = (
  visualIndex: number,
  count: number,
  cloneCount: number
) => {
  if (cloneCount === 0) {
    return clampIndex(visualIndex, count);
  }

  return (((visualIndex - cloneCount) % count) + count) % count;
};

const wrapVisualIndex = (
  visualIndex: number,
  count: number,
  cloneCount: number
) => {
  "worklet";

  if (cloneCount === 0) {
    if (count <= 0) {
      return 0;
    }

    return Math.min(Math.max(visualIndex, 0), count - 1);
  }

  if (visualIndex >= cloneCount + count) {
    return visualIndex - count;
  }

  if (visualIndex < cloneCount) {
    return visualIndex + count;
  }

  return visualIndex;
};

const wrapSettledTranslation = (
  visual: number,
  translateX: SharedValue<number>,
  stride: number,
  count: number,
  cloneCount: number,
  peekInset: number
) => {
  "worklet";

  const wrapped = wrapVisualIndex(visual, count, cloneCount);

  if (wrapped !== visual && stride > 0) {
    translateX.value = offsetForVisual(wrapped, stride, peekInset);
  }

  return wrapped;
};

const wrapLoopTranslation = (
  offset: number,
  stride: number,
  count: number,
  cloneCount: number,
  peekInset: number
) => {
  "worklet";

  if (stride === 0 || count <= 0 || cloneCount <= 0) {
    return { offset, shift: 0 };
  }

  const period = count * stride;
  const firstReal = offsetForVisual(cloneCount, stride, peekInset);
  const firstTrailing = offsetForVisual(cloneCount + count, stride, peekInset);

  if (offset > firstReal) {
    const shift = -Math.ceil((offset - firstReal) / period) * period;
    return { offset: offset + shift, shift };
  }

  if (offset <= firstTrailing) {
    const shift = (Math.floor((firstTrailing - offset) / period) + 1) * period;
    return { offset: offset + shift, shift };
  }

  return { offset, shift: 0 };
};

const circularDistance = (from: number, to: number, count: number) => {
  "worklet";

  const direct = Math.abs(from - to);
  return Math.min(direct, count - direct);
};

const rubberBandTranslate = (
  next: number,
  stride: number,
  count: number,
  looping: boolean,
  peekInset: number
) => {
  "worklet";

  if (looping || stride === 0 || count <= 1) {
    return next;
  }

  const max = peekInset;
  const min = offsetForVisual(count - 1, stride, peekInset);
  if (next > max) {
    return max + (next - max) * RUBBER_BAND;
  }

  if (next < min) {
    return min + (next - min) * RUBBER_BAND;
  }

  return next;
};

const getSnapVisual = (
  offsetX: number,
  velocityX: number,
  stride: number,
  count: number,
  cloneCount: number,
  peekInset: number
) => {
  "worklet";

  if (stride === 0 || count <= 0) {
    return 0;
  }

  const currentVisual = visualForOffset(offsetX, stride, peekInset);
  let target = Math.round(currentVisual);

  if (velocityX < -VELOCITY_THRESHOLD) {
    target = Math.max(target, Math.ceil(currentVisual - 0.01));
  } else if (velocityX > VELOCITY_THRESHOLD) {
    target = Math.min(target, Math.floor(currentVisual + 0.01));
  }

  const maxVisual = cloneCount === 0 ? count - 1 : cloneCount * 2 + count - 1;
  return Math.min(Math.max(target, 0), maxVisual);
};

type CarouselTrackItem = React.ReactElement<{ className?: string }>;

const getLoopedTrackItems = (
  items: CarouselTrackItem[],
  cloneCount: number
) => {
  if (cloneCount <= 0 || items.length === 0) {
    return items;
  }

  const leading = items.slice(-cloneCount).map((item) =>
    cloneElement(item, {
      key: `carousel-clone-start-${item.key}`,
    })
  );
  const trailing = items.slice(0, cloneCount).map((item) =>
    cloneElement(item, {
      key: `carousel-clone-end-${item.key}`,
    })
  );

  return [...leading, ...items, ...trailing];
};

const isTrackItem = (child: React.ReactNode): child is CarouselTrackItem => {
  return isValidElement(child);
};

const getCarouselItems = (children: React.ReactNode) => {
  return Children.toArray(children).filter(isTrackItem);
};

const usePrefersReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
};

const useAppIsActive = () => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => {
      subscription.remove();
    };
  }, []);

  return appState === "active";
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within a Carousel");
  }
  return context;
};

export const useCarousel = (): CarouselApi => {
  const {
    canScrollNext,
    canScrollPrev,
    count,
    index,
    looping,
    progress,
    scrollNext,
    scrollPrev,
    scrollTo,
  } = useCarouselContext();

  return useMemo(
    () => ({
      canScrollNext,
      canScrollPrev,
      count,
      index,
      looping,
      progress,
      scrollNext,
      scrollPrev,
      scrollTo,
    }),
    [
      canScrollNext,
      canScrollPrev,
      count,
      index,
      looping,
      progress,
      scrollNext,
      scrollPrev,
      scrollTo,
    ]
  );
};

export const Carousel = ({
  variant = "page",
  perView = DEFAULT_PER_VIEW,
  gap = DEFAULT_GAP,
  inset = 0,
  loop = false,
  autoplay = false,
  autoplayInterval = DEFAULT_AUTOPLAY_INTERVAL,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  className,
  children,
  ref,
  ...props
}: CarouselProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const appIsActive = useAppIsActive();
  const [containerWidth, setContainerWidth] = useState(0);
  const [count, setCount] = useState(0);
  const [internalIndex, setInternalIndex] = useState(() =>
    Math.max(defaultIndex, 0)
  );
  const [isDragging, setIsDragging] = useState(false);

  const isControlled = indexProp !== undefined;
  const index = isControlled ? indexProp : internalIndex;
  const looping = canEnableLoop(loop, variant, count, perView);
  const cloneCount = getLoopCloneCount(looping, variant, perView, count);
  const { itemWidth, peekInset, stride } = getTrackMetrics(
    containerWidth,
    variant,
    perView,
    gap,
    inset
  );
  const canScrollPrev = looping || index > 0;
  const canScrollNext = looping || index < count - 1;

  const translateX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const progress = useSharedValue(0);
  const strideSV = useSharedValue(0);
  const countSV = useSharedValue(0);
  const loopingSV = useSharedValue(false);
  const cloneCountSV = useSharedValue(0);
  const peekInsetSV = useSharedValue(0);
  const reduceMotionSV = useSharedValue(false);

  strideSV.value = stride;
  countSV.value = count;
  loopingSV.value = looping;
  cloneCountSV.value = cloneCount;
  peekInsetSV.value = peekInset;
  reduceMotionSV.value = reduceMotion;

  const indexRef = useRef(index);
  const countRef = useRef(count);
  const loopingRef = useRef(looping);
  const cloneCountRef = useRef(cloneCount);
  const strideRef = useRef(stride);
  const peekInsetRef = useRef(peekInset);
  const lastCommittedRef = useRef(index);

  indexRef.current = index;
  countRef.current = count;
  loopingRef.current = looping;
  cloneCountRef.current = cloneCount;
  strideRef.current = stride;
  peekInsetRef.current = peekInset;

  useLayoutEffect(() => {
    if (stride === 0) {
      return;
    }

    translateX.value = offsetForVisual(
      getVisualIndex(indexRef.current, cloneCount),
      stride,
      peekInset
    );
  }, [cloneCount, peekInset, stride, translateX]);

  useAnimatedReaction(
    () => {
      const currentStride = strideSV.value;
      if (currentStride === 0) {
        return 0;
      }

      let visual = visualForOffset(
        translateX.value,
        currentStride,
        peekInsetSV.value
      );
      const clones = cloneCountSV.value;
      if (clones === 0) {
        return visual;
      }

      const itemCount = countSV.value;
      if (itemCount <= 0) {
        return 0;
      }

      visual -= clones;
      return ((visual % itemCount) + itemCount) % itemCount;
    },
    (value) => {
      progress.value = value;
    }
  );

  const animateToVisual = useCallback(
    (visual: number, animated: boolean, onComplete: () => void) => {
      const strideNow = strideRef.current;
      const peekNow = peekInsetRef.current;
      const dest = offsetForVisual(visual, strideNow, peekNow);

      if (!animated || strideNow === 0) {
        translateX.value = offsetForVisual(
          wrapVisualIndex(visual, countRef.current, cloneCountRef.current),
          strideNow,
          peekNow
        );
        onComplete();
        return;
      }

      const finish = (finished?: boolean) => {
        "worklet";

        if (!finished) {
          return;
        }

        wrapSettledTranslation(
          visual,
          translateX,
          strideSV.value,
          countSV.value,
          cloneCountSV.value,
          peekInsetSV.value
        );
        runOnJS(onComplete)();
      };

      if (reduceMotionSV.value) {
        translateX.value = withTiming(
          dest,
          { duration: SNAP_TIMING_MS },
          finish
        );
        return;
      }

      translateX.value = withSpring(dest, SNAP_SPRING, finish);
    },
    [cloneCountSV, countSV, peekInsetSV, reduceMotionSV, strideSV, translateX]
  );

  const commitIndex = useCallback(
    (nextIndex: number) => {
      const next = clampIndex(nextIndex, countRef.current);
      lastCommittedRef.current = next;

      if (!isControlled) {
        setInternalIndex(next);
      }

      if (next !== indexRef.current) {
        onIndexChange?.(next);
      }
    },
    [isControlled, onIndexChange]
  );

  const settleVisual = useCallback(
    (visual: number, animated: boolean) => {
      animateToVisual(visual, animated, () => {
        commitIndex(
          getRealIndex(visual, countRef.current, cloneCountRef.current)
        );
      });
    },
    [animateToVisual, commitIndex]
  );

  const scrollTo = useCallback(
    (nextIndex: number, animated = true) => {
      const next = clampIndex(nextIndex, countRef.current);
      settleVisual(getVisualIndex(next, cloneCountRef.current), animated);
    },
    [settleVisual]
  );

  const scrollBy = useCallback(
    (delta: number) => {
      if (countRef.current <= 1) {
        return;
      }

      if (loopingRef.current) {
        settleVisual(
          getVisualIndex(indexRef.current, cloneCountRef.current) + delta,
          true
        );
        return;
      }

      const next = indexRef.current + delta;
      if (next >= 0 && next < countRef.current) {
        settleVisual(next, true);
      }
    },
    [settleVisual]
  );

  const scrollNext = useCallback(() => {
    scrollBy(1);
  }, [scrollBy]);

  const scrollPrev = useCallback(() => {
    scrollBy(-1);
  }, [scrollBy]);

  const onPanStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onSettledFromGesture = useCallback(
    (visual: number) => {
      setIsDragging(false);
      commitIndex(
        getRealIndex(visual, countRef.current, cloneCountRef.current)
      );
    },
    [commitIndex]
  );

  useEffect(() => {
    if (indexProp === undefined || stride === 0) {
      return;
    }

    if (indexProp === lastCommittedRef.current) {
      return;
    }

    lastCommittedRef.current = indexProp;
    settleVisual(getVisualIndex(indexProp, cloneCountRef.current), true);
  }, [indexProp, settleVisual, stride]);

  useEffect(() => {
    if (count === 0) {
      return;
    }

    AccessibilityInfo.announceForAccessibility(
      `Slide ${index + 1} of ${count}`
    );
  }, [count, index]);

  const autoplayEnabled =
    autoplay &&
    appIsActive &&
    !reduceMotion &&
    !isDragging &&
    count > 1 &&
    (looping || index < count - 1);

  useEffect(() => {
    if (!autoplayEnabled) {
      return;
    }

    const timerId = setInterval(scrollNext, autoplayInterval);
    return () => {
      clearInterval(timerId);
    };
  }, [autoplayEnabled, autoplayInterval, scrollNext]);

  useImperativeHandle(
    ref,
    () => ({
      getIndex: () => indexRef.current,
      scrollNext,
      scrollPrev,
      scrollTo,
    }),
    [scrollNext, scrollPrev, scrollTo]
  );

  const setContainerWidthIfChanged = useCallback((width: number) => {
    setContainerWidth((current) => (current === width ? current : width));
  }, []);

  const ctx = useMemo(
    () => ({
      canScrollNext,
      canScrollPrev,
      cloneCount,
      cloneCountSV,
      count,
      countSV,
      dragStartX,
      gap,
      index,
      itemWidth,
      looping,
      loopingSV,
      onPanStart,
      onSettledFromGesture,
      peekInsetSV,
      progress,
      reduceMotion,
      reduceMotionSV,
      scrollNext,
      scrollPrev,
      scrollTo,
      setContainerWidth: setContainerWidthIfChanged,
      setCount,
      strideSV,
      translateX,
    }),
    [
      canScrollNext,
      canScrollPrev,
      cloneCount,
      cloneCountSV,
      count,
      countSV,
      dragStartX,
      gap,
      index,
      itemWidth,
      looping,
      loopingSV,
      onPanStart,
      onSettledFromGesture,
      peekInsetSV,
      progress,
      reduceMotion,
      reduceMotionSV,
      scrollNext,
      scrollPrev,
      scrollTo,
      setContainerWidthIfChanged,
      strideSV,
      translateX,
    ]
  );

  return (
    <CarouselContext.Provider value={ctx}>
      <View
        className={cn("flex w-full flex-col gap-3", className)}
        data-slot="carousel"
        data-variant={variant}
        {...props}
      >
        {children}
      </View>
    </CarouselContext.Provider>
  );
};

export const CarouselContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) => {
  const {
    cloneCount,
    cloneCountSV,
    count,
    countSV,
    dragStartX,
    index,
    loopingSV,
    onPanStart,
    onSettledFromGesture,
    peekInsetSV,
    reduceMotionSV,
    scrollNext,
    scrollPrev,
    setContainerWidth,
    setCount,
    strideSV,
    translateX,
  } = useCarouselContext();

  const items = useMemo(() => getCarouselItems(children), [children]);

  useEffect(() => {
    setCount(items.length);
  }, [items.length, setCount]);

  const trackItems = useMemo(
    () => getLoopedTrackItems(items, cloneCount),
    [cloneCount, items]
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setContainerWidth(event.nativeEvent.layout.width);
    },
    [setContainerWidth]
  );

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const snapEpoch = useSharedValue(0);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-GESTURE_ACTIVE_OFFSET_X, GESTURE_ACTIVE_OFFSET_X])
        .failOffsetY([-GESTURE_FAIL_OFFSET_Y, GESTURE_FAIL_OFFSET_Y])
        .enabled(count > 1)
        .onStart(() => {
          snapEpoch.value += 1;
          dragStartX.value = translateX.value;
          runOnJS(onPanStart)();
        })
        .onUpdate((event) => {
          const next = rubberBandTranslate(
            dragStartX.value + event.translationX,
            strideSV.value,
            countSV.value,
            loopingSV.value,
            peekInsetSV.value
          );
          const wrapped = wrapLoopTranslation(
            next,
            strideSV.value,
            countSV.value,
            cloneCountSV.value,
            peekInsetSV.value
          );
          dragStartX.value += wrapped.shift;
          translateX.value = wrapped.offset;
        })
        .onFinalize((event) => {
          snapEpoch.value += 1;
          const epoch = snapEpoch.value;
          const stride = strideSV.value;
          const itemCount = countSV.value;
          const clones = cloneCountSV.value;
          const peekInset = peekInsetSV.value;
          const target = getSnapVisual(
            translateX.value,
            event.velocityX,
            stride,
            itemCount,
            clones,
            peekInset
          );

          const finish = (finished?: boolean) => {
            if (!(finished && snapEpoch.value === epoch)) {
              return;
            }

            runOnJS(onSettledFromGesture)(
              wrapSettledTranslation(
                target,
                translateX,
                stride,
                itemCount,
                clones,
                peekInset
              )
            );
          };

          if (stride === 0) {
            finish(true);
            return;
          }

          const dest = offsetForVisual(target, stride, peekInset);

          if (reduceMotionSV.value) {
            translateX.value = withTiming(
              dest,
              { duration: SNAP_TIMING_MS },
              finish
            );
            return;
          }

          translateX.value = withSpring(dest, SNAP_SPRING, finish);
        }),
    [
      cloneCountSV,
      count,
      countSV,
      dragStartX,
      loopingSV,
      onPanStart,
      onSettledFromGesture,
      peekInsetSV,
      reduceMotionSV,
      snapEpoch,
      strideSV,
      translateX,
    ]
  );

  return (
    <View
      accessibilityActions={[{ name: "decrement" }, { name: "increment" }]}
      accessibilityRole="adjustable"
      accessibilityValue={{
        max: Math.max(count, 1),
        min: 1,
        now: index + 1,
      }}
      className={cn("min-h-0 w-full flex-1 overflow-hidden", className)}
      data-slot="carousel-content"
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "increment") {
          scrollNext();
          return;
        }

        if (event.nativeEvent.actionName === "decrement") {
          scrollPrev();
        }
      }}
      onLayout={onLayout}
      {...props}
    >
      <GestureDetector gesture={pan}>
        <Animated.View className="h-full w-full">
          <Animated.View className="h-full flex-row" style={trackStyle}>
            {trackItems}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export const CarouselItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) => {
  const { gap, itemWidth } = useCarouselContext();

  return (
    <View
      className={cn("h-full shrink-0", className)}
      data-slot="carousel-item"
      style={{ marginEnd: gap, width: itemWidth }}
      {...props}
    >
      {children}
    </View>
  );
};

export const CarouselPrevious = ({
  accessibilityLabel = "Previous",
  disabled,
  variant = "outline",
  size = "icon",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children">) => {
  const { canScrollPrev, scrollPrev } = useCarouselContext();

  return (
    <Button
      accessibilityLabel={accessibilityLabel}
      disabled={disabled ?? !canScrollPrev}
      onPress={scrollPrev}
      size={size}
      variant={variant}
      {...props}
    >
      <ButtonIcon>
        <ChevronLeftIcon />
      </ButtonIcon>
    </Button>
  );
};

export const CarouselNext = ({
  accessibilityLabel = "Next",
  disabled,
  variant = "outline",
  size = "icon",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children">) => {
  const { canScrollNext, scrollNext } = useCarouselContext();

  return (
    <Button
      accessibilityLabel={accessibilityLabel}
      disabled={disabled ?? !canScrollNext}
      onPress={scrollNext}
      size={size}
      variant={variant}
      {...props}
    >
      <ButtonIcon>
        <ChevronRightIcon />
      </ButtonIcon>
    </Button>
  );
};

const CarouselDot = ({ position }: { position: number }) => {
  const { count, index, progress, reduceMotion, scrollTo } =
    useCarouselContext();

  const dotStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      const isActive = index === position;
      return {
        opacity: isActive ? 1 : 0.3,
        width: isActive ? DOT_SIZE + DOT_GROW : DOT_SIZE,
      };
    }

    const distance = circularDistance(progress.value, position, count);
    const influence = interpolate(
      distance,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: 0.3 + 0.7 * influence,
      width: DOT_SIZE + DOT_GROW * influence,
    };
  });

  return (
    <Pressable
      accessibilityLabel={`Go to slide ${position + 1}`}
      accessibilityRole="button"
      accessibilityState={{ selected: index === position }}
      className="items-center justify-center p-1"
      onPress={() => {
        scrollTo(position);
      }}
    >
      <Animated.View
        className="h-2 rounded-full bg-foreground"
        style={dotStyle}
      />
    </Pressable>
  );
};

export const CarouselDots = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  const { count, index } = useCarouselContext();

  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, position) => ({
        id: `slide-${position}`,
        position,
      })),
    [count]
  );

  return (
    <View
      accessibilityLabel={`Slide ${index + 1} of ${count}`}
      className={cn("flex-row items-center justify-center", className)}
      data-slot="carousel-dots"
      {...props}
    >
      {dots.map((dot) => (
        <CarouselDot key={dot.id} position={dot.position} />
      ))}
    </View>
  );
};
