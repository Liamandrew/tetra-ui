import { cn } from "@repo/shadcn-ui/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type PhoneFrameProps = {
  children?: ReactNode;
  className?: string;
  /** Slight float animation for hero mockups */
  float?: boolean;
  style?: CSSProperties;
};

export function PhoneFrame({
  children,
  className,
  float = false,
  style,
}: PhoneFrameProps) {
  return (
    <div
      aria-hidden={children ? undefined : true}
      className={cn(
        "relative w-[min(100%,17.5rem)] shrink-0",
        float && "max-lg:animate-none lg:motion-safe:animate-phone-float",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "relative aspect-1350/2760",
          children
            ? "filter-[drop-shadow(0_18px_28px_oklch(0.145_0_0/0.16))] dark:filter-[drop-shadow(0_22px_36px_oklch(0_0_0/0.55))]"
            : "overflow-hidden rounded-4xl border border-border bg-muted"
        )}
      >
        {children ?? (
          <div className="flex h-full flex-col justify-between p-6 pt-10">
            <div className="space-y-3">
              <div className="h-2.5 w-1/3 rounded-full bg-foreground/15" />
              <div className="h-8 w-2/3 rounded-lg bg-foreground/10" />
              <div className="mt-6 space-y-2">
                <div className="h-16 rounded-xl bg-background/80" />
                <div className="h-16 rounded-xl bg-background/60" />
                <div className="h-16 rounded-xl bg-background/40" />
              </div>
            </div>
            <div className="h-10 rounded-full bg-foreground/15" />
          </div>
        )}
      </div>
    </div>
  );
}
