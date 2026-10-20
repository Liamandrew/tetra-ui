import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import ts from "typescript";
import registry from "../registry/registry.json";

const items = new Map(registry.items.map((item) => [item.name, item]));
type RegistryItem = (typeof registry.items)[number];
const COMPONENT_IMPORT = /^@\/registry\/ui\/([^/]+)/;

const collectDependencies = (
  item: RegistryItem,
  visited = new Set<string>()
) => {
  const components = new Set<string>();
  const packages = new Set(item.dependencies ?? []);
  visited.add(item.name);
  for (const dependency of item.registryDependencies ?? []) {
    const name = dependency.replace("@tetra-ui/", "");
    components.add(name);
    const child = items.get(name);
    if (!child || visited.has(name)) {
      continue;
    }
    const nested = collectDependencies(child, visited);
    for (const component of nested.components) {
      components.add(component);
    }
    for (const pkg of nested.packages) {
      packages.add(pkg);
    }
  }
  return { components, packages };
};

// These are required by the documented installation before adding components.
const setupPackages = new Set([
  "react",
  "react-native",
  "uniwind",
  "class-variance-authority",
  "cn",
]);

describe("registry dependencies", () => {
  for (const item of registry.items) {
    it(`${item.name} installs its imported components and native packages`, () => {
      const dependencies = collectDependencies(item);
      for (const file of item.files) {
        const path = resolve(import.meta.dirname, "..", file.path);
        const source = ts.createSourceFile(
          path,
          readFileSync(path, "utf8"),
          ts.ScriptTarget.Latest
        );
        for (const statement of source.statements) {
          if (
            !(
              ts.isImportDeclaration(statement) &&
              ts.isStringLiteral(statement.moduleSpecifier)
            )
          ) {
            continue;
          }
          const specifier = statement.moduleSpecifier.text;
          const component = specifier.match(COMPONENT_IMPORT)?.[1];
          if (component) {
            assert.ok(
              component === item.name || dependencies.components.has(component),
              `${item.name} must install @tetra-ui/${component}`
            );
          } else if (
            !(specifier.startsWith(".") || specifier.startsWith("@/"))
          ) {
            const pkg = specifier.startsWith("@")
              ? specifier.split("/").slice(0, 2).join("/")
              : specifier.split("/")[0];
            assert.ok(
              pkg && (setupPackages.has(pkg) || dependencies.packages.has(pkg)),
              `${item.name} must install ${pkg}`
            );
          }
        }
      }
    });
  }
});
