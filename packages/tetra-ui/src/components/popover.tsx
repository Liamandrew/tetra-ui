import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Pressable, type PressableProps } from "react-native";
import * as Slot from "./slot";

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

export const PopoverTrigger = ({ asChild, ...props }: PopoverTriggerProps) => {
  const { onOpenChange } = usePopover();

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={() => onOpenChange(true)} />;
};

export const PopoverContent = () => {
  return null;
};
