export type SegmentedControlProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export type SegmentedControlItemProps = {
  value: string;
  children: React.ReactElement | React.ReactElement[];
};

export type SegmentedControlItemLabelProps = {
  children: string;
};

export type SegmentedControlItemData = {
  value: string;
  label: string;
};
