import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, useWindowDimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  Pressable as GestureHandlerPressable,
} from "react-native-gesture-handler";
import ReanimatedSwipeable, {
  type SwipeableProps as ReanimatedSwipeableProps,
  type SwipeableMethods,
  SwipeDirection,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { withUniwind } from "uniwind";
import { cn } from "@/registry/lib/utils";

export type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

const Pressable = withUniwind(GestureHandlerPressable);

// Types
type SwipeableSlot = "content" | "action-group";

type SwipeableSlotComponent = {
  slot?: SwipeableSlot;
};

export type SwipeableEdge = "leading" | "trailing";

export type SwipeableListProps = {
  children: React.ReactNode;
  /** When true, opening one row closes every other registered row. */
  exclusive?: boolean;
};

export type SwipeableContentProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Tap handler for the row. Implemented with Gesture.Tap so it can succeed
   * alongside a parent scroll/swipe pan — RNGH Pressable cancels too easily.
   */
  onPress?: () => void;
  disabled?: boolean;
};

export type SwipeableActionGroupProps = {
  edge: SwipeableEdge;
  allowsFullSwipe?: boolean;
  children?: React.ReactNode;
  className?: string;
};

type SwipeableActionVariant = VariantProps<
  typeof swipeableActionVariants
>["variant"];

export type SwipeableActionProps = Omit<
  React.ComponentProps<typeof Pressable>,
  "children"
> &
  VariantProps<typeof swipeableActionVariants> & {
    children?: React.ReactNode;
  };

type SwipeableActionContextValue = {
  foregroundOpacity: SharedValue<number>;
  variant: SwipeableActionVariant;
};

type SwipeableExclusiveMember = {
  close: () => void;
};

type SwipeableListContextValue = {
  join: (member: SwipeableExclusiveMember) => () => void;
  opened: (member: SwipeableExclusiveMember) => void;
  closeAll: () => void;
};

type ClassNameElement = React.ReactElement<{ className?: string }>;

type ParsedSwipeableSlots = {
  content?: React.ReactNode;
  contentClassName?: string;
  contentDisabled?: boolean;
  contentOnPress?: SwipeableContentProps["onPress"];
  leadingActions?: React.ReactElement<SwipeableActionGroupProps>;
  trailingActions?: React.ReactElement<SwipeableActionGroupProps>;
};

type FullSwipeRole = "outermost" | "secondary";

// Constants
/** Arm when |translation| crosses this fraction of the window width. */
const FULL_SWIPE_TRIGGER_RATIO = 0.5;
/** Disarm when pulled back below this fraction (while dragging). */
const FULL_SWIPE_CANCEL_RATIO = 0.45;
const FULL_SWIPE_DIM_OPACITY = 0.1;
const FULL_SWIPE_DIM_MS = 160;

const DEFAULT_ANIMATION_OPTIONS = {
  damping: 14,
  mass: 0.75,
  overshootClamping: false,
  stiffness: 200,
};

/** Multi-action overshoot resistance (RNGH: drag maps 1:friction past open). */
const DEFAULT_OVERSHOOT_FRICTION = 1.25;
/** Single-action overshoot — still reaches half-screen, feels less loose. */
const SINGLE_ACTION_OVERSHOOT_FRICTION = 2;
/** Pan must move this far before a swipe wins over a row tap. */
const DEFAULT_DRAG_OFFSET = 24;
/** Max finger travel that still counts as a tap. Keep below DEFAULT_DRAG_OFFSET. */
const TAP_MAX_DISTANCE = 16;

// Context
const SwipeableActionContext =
  createContext<SwipeableActionContextValue | null>(null);
const SwipeableMethodsContext = createContext<(() => void) | null>(null);
const SwipeableFullSwipeContext = createContext<{
  armed: SharedValue<boolean>;
  role: FullSwipeRole;
} | null>(null);
const SwipeableListContext = createContext<SwipeableListContextValue | null>(
  null
);

const useSwipeableActionContext = () => {
  const context = useContext(SwipeableActionContext);
  if (!context) {
    throw new Error(
      "SwipeableAction parts must be used within a SwipeableAction"
    );
  }
  return context;
};

const SwipeablePressable = ({
  children,
  className,
  disabled,
  onPress,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onPress: () => void;
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    onPress();
  }, [disabled, onPress]);

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(!disabled)
        .maxDistance(TAP_MAX_DISTANCE)
        .runOnJS(true)
        .shouldCancelWhenOutside(false)
        .onBegin(() => {
          setPressed(true);
        })
        .onFinalize(() => {
          setPressed(false);
        })
        .onEnd(() => {
          handlePress();
        }),
    [disabled, handlePress]
  );

  return (
    <GestureDetector gesture={tapGesture}>
      <View
        accessibilityRole="button"
        className={cn("w-full bg-card", className)}
        collapsable={false}
        data-pressed={pressed || undefined}
        data-slot="swipeable"
      >
        {children}
      </View>
    </GestureDetector>
  );
};

// Utils
const getSlot = (type: string | React.JSXElementConstructor<unknown>) =>
  typeof type === "string" ? undefined : (type as SwipeableSlotComponent).slot;

const parseSlots = (children: React.ReactNode): ParsedSwipeableSlots => {
  const slots: ParsedSwipeableSlots = {};

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    const slot = getSlot(child.type);

    if (slot === "content") {
      const props = child.props as SwipeableContentProps;
      slots.content = props.children;
      slots.contentClassName = props.className;
      slots.contentDisabled = props.disabled;
      slots.contentOnPress = props.onPress;
      continue;
    }

    if (slot !== "action-group") {
      continue;
    }

    const group = child as React.ReactElement<SwipeableActionGroupProps>;
    if (group.props.edge === "leading") {
      slots.leadingActions = group;
    } else {
      slots.trailingActions = group;
    }
  }

  return slots;
};

const getActions = (children?: React.ReactNode) =>
  Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === SwipeableAction
  ) as React.ReactElement<SwipeableActionProps>[];

const getOutermostAction = (
  edge: SwipeableEdge,
  actions: React.ReactElement<SwipeableActionProps>[]
) => (edge === "trailing" ? actions.at(-1) : actions.at(0));

const invokeOutermostAction = (
  edge: SwipeableEdge,
  children?: React.ReactNode
) => {
  const action = getOutermostAction(edge, getActions(children));
  action?.props.onPress?.(
    {} as Parameters<NonNullable<SwipeableActionProps["onPress"]>>[0]
  );
};

const allowsFullSwipe = (
  group?: React.ReactElement<SwipeableActionGroupProps>
) => group?.props.allowsFullSwipe ?? true;

const actionCount = (group?: React.ReactElement<SwipeableActionGroupProps>) =>
  group ? getActions(group.props.children).length : 0;

/** Lock measured width so overshoot bleed grows outside the tile cluster. */
const useLockedWidthStyle = () => {
  const width = useSharedValue(0);
  const style = useAnimatedStyle(() =>
    width.value > 0 ? { width: width.value } : {}
  );
  const onLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    if (width.value === 0) {
      width.value = event.nativeEvent.layout.width;
    }
  };
  return { onLayout, style, width };
};

// Full-swipe arming (UI thread)
/**
 * Arm/disarm from absolute translation vs screen width — only while dragging.
 * Freezes after release so the open-snap spring cannot clear a valid arm
 * (single narrow actions spring below the cancel distance before willOpen).
 */
const FullSwipeArmer = ({
  armed,
  cancelDistance,
  enabled,
  isDragging,
  translation,
  triggerDistance,
}: {
  armed: SharedValue<boolean>;
  cancelDistance: number;
  enabled: boolean;
  isDragging: SharedValue<boolean>;
  translation: SharedValue<number>;
  triggerDistance: number;
}) => {
  useAnimatedReaction(
    () => ({
      distance: Math.abs(translation.value),
      dragging: isDragging.value,
    }),
    ({ distance, dragging }) => {
      if (!enabled) {
        armed.value = false;
        return;
      }
      if (!dragging) {
        return;
      }
      if (distance >= triggerDistance) {
        armed.value = true;
        return;
      }
      if (distance < cancelDistance) {
        armed.value = false;
      }
    },
    [armed, cancelDistance, enabled, isDragging, triggerDistance]
  );

  return null;
};

// Action panel
const ActionTile = ({ children }: { children: React.ReactNode }) => {
  const { onLayout, style } = useLockedWidthStyle();

  return (
    <Animated.View
      className="h-full shrink-0 overflow-hidden"
      onLayout={onLayout}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

const ActionGroupPanel = ({
  armed,
  allowsFullSwipe: fullSwipeEnabled,
  edge,
  translation,
  className,
  children,
}: {
  armed: SharedValue<boolean>;
  allowsFullSwipe: boolean;
  edge: SwipeableEdge;
  translation: SharedValue<number>;
  className?: string;
  children: React.ReactNode;
}) => {
  const naturalWidth = useSharedValue(0);

  const panelStyle = useAnimatedStyle(() => {
    if (naturalWidth.value === 0) {
      return { opacity: 0 };
    }

    const width = Math.max(naturalWidth.value, Math.abs(translation.value));
    const offset =
      edge === "trailing"
        ? translation.value + width
        : translation.value - width;

    return {
      opacity: 1,
      transform: [{ translateX: offset }],
      width,
    };
  });

  const actions = getActions(children);
  const outermostIndex = edge === "trailing" ? actions.length - 1 : 0;
  const fillVariant =
    getOutermostAction(edge, actions)?.props.variant ?? "default";

  const outermostCtx = useMemo(
    () => ({ armed, role: "outermost" as const }),
    [armed]
  );
  const secondaryCtx = useMemo(
    () => ({ armed, role: "secondary" as const }),
    [armed]
  );

  return (
    <Animated.View
      className={cn(
        "h-full flex-row items-stretch",
        edge === "leading" && "justify-end",
        swipeablePanelFillVariants({ variant: fillVariant }),
        className
      )}
      data-slot={
        edge === "trailing"
          ? "swipeable-actions-trailing"
          : "swipeable-actions-leading"
      }
      onLayout={(event) => {
        if (naturalWidth.value === 0) {
          naturalWidth.value = event.nativeEvent.layout.width;
        }
      }}
      style={panelStyle}
    >
      {actions.map((action, index) => {
        const node = fullSwipeEnabled ? (
          <SwipeableFullSwipeContext.Provider
            value={index === outermostIndex ? outermostCtx : secondaryCtx}
          >
            {action}
          </SwipeableFullSwipeContext.Provider>
        ) : (
          action
        );

        return (
          <ActionTile key={action.key ?? `swipeable-action-${index}`}>
            {node}
          </ActionTile>
        );
      })}
    </Animated.View>
  );
};

// List
export const SwipeableList = ({
  children,
  exclusive = true,
}: SwipeableListProps) => {
  const members = useRef(new Set<SwipeableExclusiveMember>());

  const context = useMemo<SwipeableListContextValue>(
    () => ({
      closeAll: () => {
        for (const row of members.current) {
          row.close();
        }
      },
      join: (row) => {
        members.current.add(row);
        return () => {
          members.current.delete(row);
        };
      },
      opened: (row) => {
        if (!exclusive) {
          return;
        }
        for (const other of members.current) {
          if (other !== row) {
            other.close();
          }
        }
      },
    }),
    [exclusive]
  );

  return (
    <SwipeableListContext.Provider value={context}>
      {children}
    </SwipeableListContext.Provider>
  );
};
SwipeableList.displayName = "SwipeableList";

/** Close every row in the enclosing `SwipeableList`. No-op outside one. */
export const useSwipeableList = () => {
  const list = useContext(SwipeableListContext);
  return {
    closeAll: useCallback(() => list?.closeAll(), [list]),
  };
};

// Row
export type SwipeableProps = Omit<
  ReanimatedSwipeableProps,
  | "children"
  | "overshootLeft"
  | "overshootRight"
  | "renderLeftActions"
  | "renderRightActions"
> & {
  children: React.ReactNode;
};

export const Swipeable = ({
  children,
  friction = 1,
  overshootFriction,
  animationOptions,
  onSwipeableOpenStartDrag,
  onSwipeableCloseStartDrag,
  onSwipeableWillOpen,
  onSwipeableWillClose,
  dragOffsetFromLeftEdge = DEFAULT_DRAG_OFFSET,
  dragOffsetFromRightEdge = DEFAULT_DRAG_OFFSET,
  ref,
  ...props
}: SwipeableProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const triggerDistance = windowWidth * FULL_SWIPE_TRIGGER_RATIO;
  const cancelDistance = windowWidth * FULL_SWIPE_CANCEL_RATIO;

  const methodsRef = useRef<SwipeableMethods | null>(null);
  const leadingArmed = useSharedValue(false);
  const trailingArmed = useSharedValue(false);
  const isDragging = useSharedValue(false);

  const list = useContext(SwipeableListContext);
  const closeRef = useRef(() => methodsRef.current?.close());
  closeRef.current = () => methodsRef.current?.close();
  const member = useRef<SwipeableExclusiveMember>({
    close: () => closeRef.current(),
  }).current;

  useEffect(() => list?.join(member), [list, member]);

  const announceOpen = useCallback(() => {
    list?.opened(member);
  }, [list, member]);

  const {
    content,
    contentClassName,
    contentDisabled,
    contentOnPress,
    leadingActions,
    trailingActions,
  } = useMemo(() => parseSlots(children), [children]);

  if (__DEV__ && content === undefined) {
    throw new Error("Swipeable: SwipeableContent is required.");
  }

  const leadingFullSwipe = allowsFullSwipe(leadingActions);
  const trailingFullSwipe = allowsFullSwipe(trailingActions);
  const resolvedOvershootFriction =
    overshootFriction ??
    ((leadingFullSwipe && actionCount(leadingActions) === 1) ||
    (trailingFullSwipe && actionCount(trailingActions) === 1)
      ? SINGLE_ACTION_OVERSHOOT_FRICTION
      : DEFAULT_OVERSHOOT_FRICTION);

  const resolvedAnimationOptions = useMemo(
    () => ({ ...DEFAULT_ANIMATION_OPTIONS, ...animationOptions }),
    [animationOptions]
  );

  const setMethodsRef = useCallback(
    (methods: SwipeableMethods | null) => {
      methodsRef.current = methods;
      if (typeof ref === "function") {
        ref(methods);
        return;
      }
      if (ref) {
        ref.current = methods;
      }
    },
    [ref]
  );

  const commitFullSwipe = useCallback(
    (
      edge: SwipeableEdge,
      armed: SharedValue<boolean>,
      group?: React.ReactElement<SwipeableActionGroupProps>
    ) => {
      if (!(allowsFullSwipe(group) && armed.value)) {
        return;
      }
      armed.value = false;
      invokeOutermostAction(edge, group?.props.children);
      methodsRef.current?.close();
    },
    []
  );

  const handleOpenStartDrag = useCallback(
    (direction: SwipeDirection) => {
      isDragging.value = true;
      onSwipeableOpenStartDrag?.(direction);
      announceOpen();
    },
    [announceOpen, isDragging, onSwipeableOpenStartDrag]
  );

  const handleCloseStartDrag = useCallback(
    (direction: SwipeDirection) => {
      isDragging.value = true;
      onSwipeableCloseStartDrag?.(direction);
    },
    [isDragging, onSwipeableCloseStartDrag]
  );

  const handleWillOpen = useCallback(
    (direction: SwipeDirection) => {
      // Freeze arm state before the open-snap spring runs.
      isDragging.value = false;
      onSwipeableWillOpen?.(direction);
      announceOpen();

      if (direction === SwipeDirection.LEFT) {
        commitFullSwipe("trailing", trailingArmed, trailingActions);
        return;
      }
      commitFullSwipe("leading", leadingArmed, leadingActions);
    },
    [
      announceOpen,
      commitFullSwipe,
      isDragging,
      leadingActions,
      leadingArmed,
      onSwipeableWillOpen,
      trailingActions,
      trailingArmed,
    ]
  );

  const handleWillClose = useCallback(
    (direction: SwipeDirection) => {
      isDragging.value = false;
      leadingArmed.value = false;
      trailingArmed.value = false;
      onSwipeableWillClose?.(direction);
    },
    [isDragging, leadingArmed, onSwipeableWillClose, trailingArmed]
  );

  const renderActions = useCallback(
    (
      edge: SwipeableEdge,
      group: React.ReactElement<SwipeableActionGroupProps> | undefined,
      armed: SharedValue<boolean>,
      translation: SharedValue<number>,
      methods: SwipeableMethods
    ) => {
      if (!group) {
        return null;
      }

      methodsRef.current = methods;

      return (
        <SwipeableMethodsContext.Provider value={methods.close}>
          <FullSwipeArmer
            armed={armed}
            cancelDistance={cancelDistance}
            enabled={allowsFullSwipe(group)}
            isDragging={isDragging}
            translation={translation}
            triggerDistance={triggerDistance}
          />
          <ActionGroupPanel
            allowsFullSwipe={allowsFullSwipe(group)}
            armed={armed}
            className={group.props.className}
            edge={edge}
            translation={translation}
          >
            {group.props.children}
          </ActionGroupPanel>
        </SwipeableMethodsContext.Provider>
      );
    },
    [cancelDistance, isDragging, triggerDistance]
  );

  const renderLeftActions = useCallback(
    (
      _progress: SharedValue<number>,
      translation: SharedValue<number>,
      methods: SwipeableMethods
    ) =>
      renderActions(
        "leading",
        leadingActions,
        leadingArmed,
        translation,
        methods
      ),
    [leadingActions, leadingArmed, renderActions]
  );

  const renderRightActions = useCallback(
    (
      _progress: SharedValue<number>,
      translation: SharedValue<number>,
      methods: SwipeableMethods
    ) =>
      renderActions(
        "trailing",
        trailingActions,
        trailingArmed,
        translation,
        methods
      ),
    [renderActions, trailingActions, trailingArmed]
  );

  return (
    <ReanimatedSwipeable
      animationOptions={resolvedAnimationOptions}
      dragOffsetFromLeftEdge={dragOffsetFromLeftEdge}
      dragOffsetFromRightEdge={dragOffsetFromRightEdge}
      friction={friction}
      onSwipeableCloseStartDrag={handleCloseStartDrag}
      onSwipeableOpenStartDrag={handleOpenStartDrag}
      onSwipeableWillClose={handleWillClose}
      onSwipeableWillOpen={handleWillOpen}
      overshootFriction={resolvedOvershootFriction}
      overshootLeft={Boolean(leadingActions)}
      overshootRight={Boolean(trailingActions)}
      ref={setMethodsRef}
      renderLeftActions={leadingActions ? renderLeftActions : undefined}
      renderRightActions={trailingActions ? renderRightActions : undefined}
      {...props}
    >
      {contentOnPress ? (
        <SwipeablePressable
          className={contentClassName}
          disabled={contentDisabled}
          onPress={contentOnPress}
        >
          {content}
        </SwipeablePressable>
      ) : (
        <View
          className={cn("w-full bg-card", contentClassName)}
          data-slot="swipeable"
        >
          {content}
        </View>
      )}
    </ReanimatedSwipeable>
  );
};
Swipeable.displayName = "Swipeable";

// Slots
export const SwipeableContent = (_props: SwipeableContentProps) => null;
SwipeableContent.displayName = "SwipeableContent";
SwipeableContent.slot = "content" as const;

export const SwipeableActionGroup = (_props: SwipeableActionGroupProps) => null;
SwipeableActionGroup.displayName = "SwipeableActionGroup";
SwipeableActionGroup.slot = "action-group" as const;

export const SwipeableAction = ({
  children,
  className,
  variant = "default",
  accessibilityRole = "button",
  onPress,
  ...props
}: SwipeableActionProps) => {
  const close = useContext(SwipeableMethodsContext);
  const fullSwipe = useContext(SwipeableFullSwipeContext);
  const foregroundOpacity = useSharedValue(1);

  const ctx = useMemo(
    () => ({ foregroundOpacity, variant }),
    [foregroundOpacity, variant]
  );

  useAnimatedReaction(
    () => fullSwipe?.armed.value ?? false,
    (isArmed, previous) => {
      if (isArmed === previous) {
        return;
      }
      // Dim label/icon only — keep the tile fill opaque over bleed.
      if (fullSwipe?.role !== "secondary") {
        foregroundOpacity.value = 1;
        return;
      }
      foregroundOpacity.value = withTiming(
        isArmed ? FULL_SWIPE_DIM_OPACITY : 1,
        {
          duration: FULL_SWIPE_DIM_MS,
        }
      );
    },
    [fullSwipe, foregroundOpacity]
  );

  return (
    <SwipeableActionContext.Provider value={ctx}>
      <Pressable
        accessibilityRole={accessibilityRole}
        className={cn(swipeableActionVariants({ variant }), className)}
        data-slot="swipeable-action"
        {...props}
        onPress={(event) => {
          onPress?.(event);
          close?.();
        }}
      >
        {Children.map(children, (child) =>
          typeof child === "string" ? (
            <SwipeableActionText>{child}</SwipeableActionText>
          ) : (
            child
          )
        )}
      </Pressable>
    </SwipeableActionContext.Provider>
  );
};
SwipeableAction.displayName = "SwipeableAction";

const Foreground = ({ children }: { children: React.ReactNode }) => {
  const { foregroundOpacity } = useSwipeableActionContext();
  const style = useAnimatedStyle(() => ({
    opacity: foregroundOpacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export const SwipeableActionText = ({
  className,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) => {
  const { variant } = useSwipeableActionContext();

  return (
    <Foreground>
      <Text
        className={cn(swipeableActionTextVariants({ variant }), className)}
        data-slot="swipeable-action-text"
        numberOfLines={numberOfLines}
        {...props}
      />
    </Foreground>
  );
};
SwipeableActionText.displayName = "SwipeableActionText";

export const SwipeableActionIcon = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { variant } = useSwipeableActionContext();
  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "SwipeableActionIcon expects a single React element as children"
      );
    }
    return null;
  }

  const element = child as ClassNameElement;

  return (
    <Foreground>
      {cloneElement(element, {
        ...props,
        className: cn(
          swipeableActionIconVariants({ variant }),
          className,
          element.props.className
        ),
      })}
    </Foreground>
  );
};
SwipeableActionIcon.displayName = "SwipeableActionIcon";

// Styles
const swipeablePanelFillVariants = cva("", {
  defaultVariants: { variant: "default" },
  variants: {
    variant: {
      default: "bg-primary",
      destructive: "bg-destructive",
      secondary: "bg-secondary",
    },
  },
});

const swipeableActionVariants = cva(
  "h-full w-full min-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden px-3",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/90",
        destructive: "bg-destructive active:bg-destructive/90",
        secondary: "bg-secondary active:bg-secondary/90",
      },
    },
  }
);

const swipeableActionTextVariants = cva(
  "shrink-0 text-center font-medium text-sm",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-white",
        secondary: "text-secondary-foreground",
      },
    },
  }
);

const swipeableActionIconVariants = cva("size-5", {
  defaultVariants: { variant: "default" },
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      secondary: "text-secondary-foreground",
    },
  },
});
