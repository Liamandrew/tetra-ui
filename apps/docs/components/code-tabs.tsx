"use client";

import { Tabs } from "@repo/shadcn-ui/components/tabs";
import type * as React from "react";

export function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs className="relative mt-6 w-full" defaultValue="pnpm">
      {children}
    </Tabs>
  );
}
