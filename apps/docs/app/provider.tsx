"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { FrameworkLink } from "@/components/framework-link";

const SearchDialog = dynamic(() => import("@/components/search"), {
  ssr: false,
});

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      components={{
        Link: FrameworkLink,
      }}
      search={{
        SearchDialog,
      }}
    >
      {children}
    </RootProvider>
  );
}
