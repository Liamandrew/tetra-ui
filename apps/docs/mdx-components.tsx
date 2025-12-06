import { Button } from "@repo/shadcn-ui/components/button";
import * as TabsComponents from "@repo/shadcn-ui/components/tabs";
import { cn } from "@repo/shadcn-ui/lib/utils";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/code-block";
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { CodeTabs } from "@/components/code-tabs";
import { ComponentPreview } from "@/components/component-preview";
import { ComponentSource } from "@/components/component-source";
import { ComponentsList } from "@/components/components-list";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...TabsComponents,
    Button,
    CodeBlock,
    CodeTabs,
    ComponentsList,
    ComponentSource,
    CodeCollapsibleWrapper,
    ComponentPreview,
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "mt-8 scroll-m-32 font-heading font-medium text-xl tracking-tight",
          className
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:mt-0!"
        {...props}
      />
    ),
  };
}
