import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      sidebar={{ collapsible: false, prefetch: false }}
    >
      {children}
    </DocsLayout>
  );
}
