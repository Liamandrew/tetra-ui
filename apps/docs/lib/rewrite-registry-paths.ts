import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_ROOT = "../../packages/tetra-ui/src/";

const getRegistryPrefix = (sourceDir: string) => {
  if (sourceDir === "components") {
    return "ui";
  }
  if (sourceDir === "hooks") {
    return "hooks";
  }
  if (sourceDir === "lib") {
    return "lib";
  }

  return null;
};

export const toSafeRegistryPath = (filePath: string) => {
  const normalized = filePath.replaceAll("\\", "/");

  if (normalized.startsWith(SOURCE_ROOT)) {
    const rest = normalized.slice(SOURCE_ROOT.length);
    const slashIndex = rest.indexOf("/");

    if (slashIndex === -1) {
      throw new Error(
        `Registry path is missing a source subdirectory: ${filePath}`
      );
    }

    const registryPrefix = getRegistryPrefix(rest.slice(0, slashIndex));

    if (!registryPrefix) {
      throw new Error(
        `Unknown source subdirectory in registry path: ${filePath}`
      );
    }

    return `${registryPrefix}/${rest.slice(slashIndex + 1)}`;
  }

  if (normalized.includes("..")) {
    throw new Error(`Cannot rewrite unsafe registry path: ${filePath}`);
  }

  return normalized;
};

export const toRegistryTarget = (rewrittenPath: string) => {
  return `@${rewrittenPath}`;
};

const REGISTRY_IMPORT_REWRITES = [
  ["@/registry/ui/", "@/components/ui/"],
  ["@/registry/lib/", "@/lib/"],
  ["@/registry/hooks/", "@/hooks/"],
] as const;

export const rewriteRegistryImports = (content: string) => {
  let nextContent = content;

  for (const [from, to] of REGISTRY_IMPORT_REWRITES) {
    nextContent = nextContent.replaceAll(from, to);
  }

  return nextContent;
};

type RegistryFile = {
  path?: string;
  target?: string;
  type?: string;
  content?: string;
};

export const rewriteFiles = (files: unknown) => {
  if (!Array.isArray(files)) {
    return files;
  }

  return files.map((file: RegistryFile) => {
    if (typeof file.path !== "string") {
      return file;
    }

    const rewrittenPath = toSafeRegistryPath(file.path);
    const nextFile = {
      ...file,
      path: rewrittenPath,
    };

    if (typeof file.content === "string") {
      nextFile.content = rewriteRegistryImports(file.content);
    }

    // shadcn flattens nested registry:ui files to the ui directory basename
    // unless target is set. @ui/native-date-select/index.ts keeps the folder.
    if (typeof file.target !== "string") {
      nextFile.target = toRegistryTarget(rewrittenPath);
    }

    return nextFile;
  });
};

type RegistryPayload = {
  items?: Array<{ files?: unknown }>;
  files?: unknown;
};

export const rewriteRegistryJson = (payload: RegistryPayload) => {
  if (Array.isArray(payload.items)) {
    return {
      ...payload,
      items: payload.items.map((item) => ({
        ...item,
        files: rewriteFiles(item.files),
      })),
    };
  }

  return {
    ...payload,
    files: rewriteFiles(payload.files),
  };
};

const defaultOutputDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/r"
);

export const rewriteRegistryOutput = async (outputDir = defaultOutputDir) => {
  const entries = await readdir(outputDir);
  const jsonFiles = entries.filter((entry) => entry.endsWith(".json"));

  await Promise.all(
    jsonFiles.map(async (entry) => {
      const filePath = path.join(outputDir, entry);
      const payload = JSON.parse(await readFile(filePath, "utf8"));
      const rewritten = rewriteRegistryJson(payload);
      await writeFile(filePath, `${JSON.stringify(rewritten, null, 2)}\n`);
    })
  );
};
