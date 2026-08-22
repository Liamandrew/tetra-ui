const REGISTRY_NAME = /^[a-z0-9-]+(?:\.json)?$/;

export const parseRegistryName = (raw: string): string | null => {
  if (!REGISTRY_NAME.test(raw)) {
    return null;
  }
  if (raw.endsWith(".json")) {
    return raw.slice(0, -5);
  }
  return raw;
};
