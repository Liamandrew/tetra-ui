import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Pressable, type PressableProps } from "react-native";

// Types
type PopoverContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type PopoverProps = Partial<PopoverContextProps> & {
  children: React.ReactNode;
};

type PopoverTriggerProps = PressableProps & {
  asChild?: boolean;
};

// Context
const PopoverContext = createContext<PopoverContextProps | null>(null);

const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a Popover");
  }
  return context;
};

// Components
export const Popover = ({
  open: openProp,
  onOpenChange,
  children,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  const ctx = useMemo(
    () => ({ open, onOpenChange: handleOpenChange }),
    [open, handleOpenChange]
  );

  return (
    <PopoverContext.Provider value={ctx}>{children}</PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({
  children,
  asChild,
  ...props
}: PopoverTriggerProps) => {
  const { onOpenChange } = usePopover();

  if (asChild) {
    const child = Children.only(children);

    if (!child) {
      if (__DEV__) {
        throw new Error(
          "PopoverTrigger expects a single React element as children"
        );
      }
      return null;
    }

    return cloneElement(child as React.ReactElement<PressableProps>, {
      ...props,
      onPress: (e) => {
        props.onPress?.(e);
        onOpenChange(true);
      },
    });
  }

  return (
    <Pressable {...props} onPress={() => onOpenChange(true)}>
      {children}
    </Pressable>
  );
};

export const PopoverContent = () => {
  return null;
};
