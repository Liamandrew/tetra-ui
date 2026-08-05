import { Children, isValidElement } from "react";
import type {
  SegmentedControlItemData,
  SegmentedControlItemLabelProps,
  SegmentedControlItemProps,
} from "./segmented-control.types";

const getChildDisplayName = (child: React.ReactNode) => {
  if (!isValidElement(child)) {
    return;
  }

  return (child.type as { displayName?: string }).displayName;
};

const extractItemLabel = (children: React.ReactNode) => {
  let label: string | undefined;

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (getChildDisplayName(child) === "SegmentedControlItemLabel") {
      label = (child.props as SegmentedControlItemLabelProps).children;
    }
  }

  return label;
};

export const extractSegmentedControlItems = (children: React.ReactNode) => {
  const items: SegmentedControlItemData[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (getChildDisplayName(child) !== "SegmentedControlItem") {
      continue;
    }

    const { value, children: itemChildren } =
      child.props as SegmentedControlItemProps;
    const label = extractItemLabel(itemChildren);

    if (typeof value !== "string" || label === undefined) {
      continue;
    }

    items.push({ label, value });
  }

  return items;
};
