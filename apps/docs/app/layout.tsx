import "@repo/shadcn-ui/globals.css";
import "@/app/global.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Provider } from "@/app/provider";
import { siteConfig } from "@/lib/config";

const geist = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  authors: [
    {
      name: "Liam Andrew",
      url: siteConfig.links.twitter,
    },
  ],
  creator: "Liam Andrew",
  description: siteConfig.description,
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
  },
  keywords: [
    "react native",
    "ui",
    "component library",
    "tetra-ui",
    "uniwind",
    "mobile",
  ],
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: siteConfig.name,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
      },
    ],
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: "website",
    url: siteConfig.url,
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@_liamandr",
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
    title: siteConfig.name,
  },
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html className={geist.className} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>
          {children}
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
