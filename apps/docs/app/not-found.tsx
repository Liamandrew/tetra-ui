import { buttonVariants } from "@repo/shadcn-ui/components/button";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/config";
import { notFoundPage } from "@/lib/site-content";

const mapLinkClassName = buttonVariants({
  className: "h-auto p-0",
  variant: "link",
});

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions}>
      <article className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <div
          aria-hidden="true"
          className="mb-6 flex size-14 items-center justify-center rounded-full bg-muted"
        >
          <Logo />
        </div>
        <h1 className="max-w-xl text-balance font-bold text-4xl leading-tight tracking-tight md:text-5xl">
          {notFoundPage.title}
        </h1>
        <p className="mt-3 max-w-md text-balance text-lg text-muted-foreground">
          {notFoundPage.description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
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
        <nav
          aria-label="Machine-readable maps"
          className="mt-16 flex flex-wrap items-center justify-center gap-x-2 text-sm"
        >
          <a className={mapLinkClassName} href={siteConfig.links.llms}>
            llms.txt
          </a>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <a className={mapLinkClassName} href={siteConfig.links.sitemap}>
            sitemap.xml
          </a>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <a className={mapLinkClassName} href={siteConfig.links.openapi}>
            openapi.json
          </a>
        </nav>
      </article>
      <Footer />
    </HomeLayout>
  );
}
