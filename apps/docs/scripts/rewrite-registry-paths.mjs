import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUTPUT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/r"
);

const SOURCE_ROOT = "../../packages/tetra-ui/src/";

function getRegistryPrefix(sourceDir) {
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
}

function toSafeRegistryPath(filePath) {
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
}

function rewriteFiles(files) {
  if (!Array.isArray(files)) {
    return files;
  }

  return files.map((file) => {
    if (typeof file?.path !== "string") {
      return file;
    }

    return {
      ...file,
      path: toSafeRegistryPath(file.path),
    };
  });
}

function rewriteRegistryJson(payload) {
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
}

const entries = await readdir(OUTPUT_DIR);
const jsonFiles = entries.filter((entry) => entry.endsWith(".json"));

await Promise.all(
  jsonFiles.map(async (entry) => {
    const filePath = path.join(OUTPUT_DIR, entry);
    const payload = JSON.parse(await readFile(filePath, "utf8"));
    const rewritten = rewriteRegistryJson(payload);
    await writeFile(filePath, `${JSON.stringify(rewritten, null, 2)}\n`);
  })
);
