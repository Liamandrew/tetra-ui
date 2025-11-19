import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/config";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Logo />
        <span className="font-bold leading-tight tracking-tight">tetra ui</span>
      </>
    ),
  },
  githubUrl: siteConfig.links.github,
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
