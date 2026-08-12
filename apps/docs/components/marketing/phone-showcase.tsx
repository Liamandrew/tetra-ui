import { cn } from "@repo/shadcn-ui/lib/utils";
import type { CSSProperties } from "react";
import { PhoneFrame } from "./phone-frame";
import { PhonePreview } from "./phone-preview";

const PREVIEWS = [
  {
    alt: "Onboarding screen to choose a Free, Pro, or Team plan",
    delay: "0s",
    eager: false,
    mobile: false,
    name: "onboarding",
    rotate: "-14deg",
    scale: 0.88,
    y: "2.15rem",
    z: 1,
  },
  {
    alt: "Email verification screen with a six-digit code field",
    delay: "0.45s",
    eager: false,
    mobile: true,
    name: "verification",
    rotate: "-7deg",
    scale: 0.94,
    y: "1rem",
    z: 2,
  },
  {
    alt: "Table reservation screen with date, time, and seating controls",
    delay: "0.9s",
    eager: true,
    mobile: true,
    name: "booking",
    rotate: "0deg",
    scale: 1,
    y: "0px",
    z: 5,
  },
  {
    alt: "Inbox screen with message list and swipe actions",
    delay: "1.35s",
    eager: false,
    mobile: true,
    name: "inbox",
    rotate: "7deg",
    scale: 0.94,
    y: "1rem",
    z: 2,
  },
  {
    alt: "Settings screen with account, notifications, and appearance",
    delay: "1.8s",
    eager: false,
    mobile: false,
    name: "settings",
    rotate: "14deg",
    scale: 0.88,
    y: "2.15rem",
    z: 1,
  },
] as const;

export function PhoneShowcase() {
  return (
    <section
      aria-label="App previews"
      className="relative w-full overflow-x-clip"
    >
      <link
        as="image"
        fetchPriority="high"
        href="/static/marketing/booking-400.webp"
        rel="preload"
        type="image/webp"
      />
      <div className="flex items-end justify-center px-4 pt-6 pb-10 lg:px-8 lg:pt-8 lg:pb-14">
        {PREVIEWS.map((preview) => (
          <div
            className={cn(
              "transform-[rotate(var(--r))_translateY(var(--y))_scale(var(--s))] origin-bottom",
              "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "lg:hover:z-20 lg:hover:[--y:0px]",
              !preview.mobile && "max-lg:hidden",
              preview.mobile &&
                preview.name !== "verification" &&
                "max-lg:-ml-14",
              preview.name !== "onboarding" && "lg:-ml-19"
            )}
            key={preview.name}
            style={
              {
                "--r": preview.rotate,
                "--s": preview.scale,
                "--y": preview.y,
                zIndex: preview.z,
              } as CSSProperties
            }
          >
            <PhoneFrame
              className={cn(
                "w-32 sm:w-36 lg:w-47",
                preview.name === "booking" && "w-40 sm:w-44 lg:w-57"
              )}
              float
              style={{ animationDelay: preview.delay }}
            >
              <PhonePreview
                alt={preview.alt}
                eager={preview.eager}
                name={preview.name}
              />
            </PhoneFrame>
          </div>
        ))}
      </div>
    </section>
  );
}
