export function getRegistryFileTitle(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");

  const hooksMatch = normalized.match(/\/hooks\/(.+)$/);
  if (hooksMatch) {
    return `hooks/${hooksMatch[1]}`;
  }

  const componentsMatch = normalized.match(/\/components\/(.+)$/);
  if (componentsMatch) {
    return `components/ui/${componentsMatch[1]}`;
  }

  const basename = normalized.split("/").pop();
  return basename ?? filePath;
}

export function getLanguageFromTitle(title: string): string {
  return title.split(".").pop() ?? "tsx";
}
