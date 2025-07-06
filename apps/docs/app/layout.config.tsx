import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

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
        <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
          <title>Tetra UI Logo</title>
          <circle cx={12} cy={12} fill="currentColor" r={12} />
        </svg>
        Tetra UI
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
