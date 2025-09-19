import { Button } from '@repo/shadcn-ui/components/button';
import { cn } from '@repo/shadcn-ui/lib/utils';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/code-block';
import { CodeCollapsibleWrapper } from '@/components/code-collapsible-wrapper';
import { ComponentSource } from '@/components/component-source';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Button,
    CodeBlock,
    ComponentSource,
    CodeCollapsibleWrapper,
    Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
      <h3
        className={cn(
          'mt-8 scroll-m-32 font-heading font-medium text-xl tracking-tight',
          className
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="[&>h3]:step steps *:[h3]:first:!mt-0 mb-12 [counter-reset:step]"
        {...props}
      />
    ),
  };
}
