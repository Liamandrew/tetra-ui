"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

const STATIC_FILE_HREF = /\.(?:txt|json|xml|md|csv)(?:[?#]|$)/i;

export function FrameworkLink({
  href,
  prefetch,
  ...props
}: ComponentProps<"a"> & { prefetch?: boolean }) {
  if (typeof href === "string" && STATIC_FILE_HREF.test(href)) {
    return <a href={href} {...props} />;
  }

  return <NextLink href={href ?? "#"} prefetch={prefetch} {...props} />;
}
