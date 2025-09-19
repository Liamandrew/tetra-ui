import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { RegistryItem } from 'shadcn/registry';

const REGISTRY_PATH = path.join(process.cwd(), 'public/r');

const getMemoizedRegistry = () => {
  const files = readdirSync(REGISTRY_PATH);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  const registryComponents: Record<string, RegistryItem> = {};

  for (const file of jsonFiles) {
    const filePath = path.join(REGISTRY_PATH, file);
    const content = readFileSync(filePath, 'utf8');
    const component = JSON.parse(content);

    registryComponents[component.name] = component;
  }

  return registryComponents;
};

const registry = getMemoizedRegistry();

export const getRegistryItem = (name: string) => {
  return registry[name];
};
