import "@repo/shadcn-ui/globals.css";
import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Geist } from "next/font/google";

const geist = Geist();

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html className={geist.className} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
