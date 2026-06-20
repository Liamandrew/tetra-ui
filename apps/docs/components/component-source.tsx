import { cn } from "@repo/shadcn-ui/lib/utils";
import { CodeBlock } from "@/components/code-block";
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { getRegistryItem } from "@/lib/registry";
import {
  getLanguageFromTitle,
  getRegistryFileTitle,
} from "@/lib/registry-file-title";

type RegistryFile = {
  path: string;
  content?: string;
};

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean;
  file?: string;
  language?: string;
  name: string;
  title?: string;
}

function resolveRegistryFiles(
  files: RegistryFile[] | undefined,
  options: { file?: string; title?: string; language?: string }
): Array<{ code: string; title: string; lang: string; path: string }> {
  if (!files?.length) {
    return [];
  }

  let selectedFiles = files.filter((file) => file.content);

  if (options.file) {
    selectedFiles = selectedFiles.filter((file) =>
      file.path.includes(options.file as string)
    );
  }

  if (!selectedFiles.length) {
    return [];
  }

  const useProvidedTitle =
    selectedFiles.length === 1 && options.title !== undefined;

  return selectedFiles.map((file, index) => {
    const fileTitle =
      useProvidedTitle && index === 0
        ? (options.title as string)
        : getRegistryFileTitle(file.path);
    const lang =
      selectedFiles.length === 1 && options.language
        ? options.language
        : getLanguageFromTitle(fileTitle);

    return {
      code: file.content as string,
      title: fileTitle,
      lang,
      path: file.path,
    };
  });
}

export function ComponentSource({
  name,
  title,
  file,
  language,
  collapsible = true,
  className,
}: ComponentSourceProps) {
  const registryItem = getRegistryItem(name);
  const sources = resolveRegistryFiles(registryItem?.files, {
    file,
    title,
    language,
  });

  if (!sources.length) {
    return null;
  }

  const blocks = sources.map((source) => (
    <CodeBlock
      code={source.code}
      key={source.path}
      lang={source.lang}
      title={source.title}
    />
  ));

  if (!collapsible) {
    return (
      <div className={cn("relative [&>figure+figure]:mt-4", className)}>
        {blocks}
      </div>
    );
  }

  return (
    <CodeCollapsibleWrapper className={className}>{blocks}</CodeCollapsibleWrapper>
  );
}
