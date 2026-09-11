import { Children, Fragment, isValidElement } from "react";

const getChildDisplayName = (child: React.ReactNode) => {
  if (!isValidElement(child)) {
    return;
  }
  return (child.type as { displayName?: string }).displayName;
};

const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
  const flattened: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return;
    }

    if (isValidElement(child) && child.type === Fragment) {
      flattened.push(
        ...flattenChildren(
          (child.props as { children?: React.ReactNode }).children
        )
      );
      return;
    }

    flattened.push(child);
  });

  return flattened;
};

export const splitBottomSheetChildren = (children: React.ReactNode) => {
  const body: React.ReactNode[] = [];
  let footer: React.ReactNode = null;
  let header: React.ReactNode = null;
  let hasScrollView = false;

  for (const child of flattenChildren(children)) {
    const displayName = getChildDisplayName(child);

    if (displayName === "BottomSheetFooter") {
      footer = child;
      continue;
    }

    if (displayName === "BottomSheetHeader") {
      header = child;
      continue;
    }

    if (displayName === "BottomSheetScrollView") {
      hasScrollView = true;
    }

    body.push(child);
  }

  return { body, footer, hasScrollView, header };
};
