const BACKSLASH_REGEX = /\\/gu;
const HOOKS_PATH_REGEX = /\/hooks\/(?<path>.+)$/u;
const COMPONENTS_PATH_REGEX = /\/components\/(?<path>.+)$/u;

export function getRegistryFileTitle(filePath: string): string {
  const normalized = filePath.replace(BACKSLASH_REGEX, "/");

  if (normalized.startsWith("ui/")) {
    return `components/${normalized}`;
  }

  if (normalized.startsWith("hooks/")) {
    return normalized;
  }

  const hooksPath = normalized.match(HOOKS_PATH_REGEX)?.groups?.path;
  if (hooksPath) {
    return `hooks/${hooksPath}`;
  }

  const componentsPath = normalized.match(COMPONENTS_PATH_REGEX)?.groups?.path;
  if (componentsPath) {
    return `components/ui/${componentsPath}`;
  }

  const basename = normalized.split("/").pop();
  return basename ?? filePath;
}

export function getLanguageFromTitle(title: string): string {
  return title.split(".").pop() ?? "tsx";
}
