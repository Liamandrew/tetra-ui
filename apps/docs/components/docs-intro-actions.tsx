import { buttonVariants } from "@repo/shadcn-ui/components/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Link from "next/link";

export function DocsIntroActions({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "not-prose mb-8 flex flex-wrap items-center gap-3",
        className
      )}
    >
      <Link className={buttonVariants()} href="/docs/installation">
        Get started
      </Link>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href="/docs/components"
      >
        Browse components
      </Link>
    </div>
  );
}
