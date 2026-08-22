import { buttonVariants } from "@repo/shadcn-ui/components/button";
import type { Metadata } from "next";
import Link from "next/link";
import { PhoneShowcase } from "@/components/marketing";
import { homePage } from "@/lib/site-content";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description: homePage.description,
};

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col pt-10 pb-6 md:pt-14">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight">
            {homePage.title}
          </h1>
          <p className="max-w-4xl text-balance text-muted-foreground">
            {homePage.description}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link className={buttonVariants()} href="/docs">
            Get Started
          </Link>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href="/docs/components"
          >
            Browse Components
          </Link>
        </div>
      </div>
      <div className="mt-10 w-full md:mt-12">
        <PhoneShowcase />
      </div>
    </div>
  );
}
