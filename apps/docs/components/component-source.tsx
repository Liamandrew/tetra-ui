import { cn } from "@repo/shadcn-ui/lib/utils";
import { CodeBlock } from "@/components/code-block";
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { getRegistryItem } from "@/lib/registry";

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  title: string;
  language?: string;
  collapsible?: boolean;
}

export function ComponentSource({
  name,
  title,
  language,
  collapsible = true,
  className,
}: ComponentSourceProps) {
  const registryItem = getRegistryItem(name);

  const code = registryItem?.files?.[0]?.content;
  const lang = language ?? title?.split(".").pop() ?? "tsx";

  if (!code) {
    return null;
  }

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <CodeBlock code={code} lang={lang} title={title} />
      </div>
    );
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <CodeBlock code={code} lang={lang} title={title} />
    </CodeCollapsibleWrapper>
  );
}
