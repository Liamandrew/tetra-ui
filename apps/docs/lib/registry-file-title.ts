const BACKSLASH_REGEX = /\\/g;
const HOOKS_PATH_REGEX = /\/hooks\/(.+)$/;
const COMPONENTS_PATH_REGEX = /\/components\/(.+)$/;

export function getRegistryFileTitle(filePath: string): string {
  const normalized = filePath.replace(BACKSLASH_REGEX, "/");

  const hooksMatch = normalized.match(HOOKS_PATH_REGEX);
  if (hooksMatch) {
    return `hooks/${hooksMatch[1]}`;
  }

  const componentsMatch = normalized.match(COMPONENTS_PATH_REGEX);
  if (componentsMatch) {
    return `components/ui/${componentsMatch[1]}`;
  }

  const basename = normalized.split("/").pop();
  return basename ?? filePath;
}

export function getLanguageFromTitle(title: string): string {
  return title.split(".").pop() ?? "tsx";
}
