import { highlight } from 'fumadocs-core/highlight';
import {
  CodeBlock as BaseCodeBlock,
  Pre as BasePre,
} from 'fumadocs-ui/components/codeblock';
import type { HTMLAttributes } from 'react';

export async function CodeBlock({
  code,
  lang,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  code: string;
  lang: string;
}) {
  const rendered = await highlight(code, {
    lang,
    components: {
      pre: (props) => <BasePre {...props} />,
    },
    // other Shiki options
  });

  return <BaseCodeBlock {...rest}>{rendered}</BaseCodeBlock>;
}
