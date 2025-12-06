import { readFileSync } from "node:fs";
import path from "node:path";

const EXAMPLE_COMPONENTS_PATH = path.join(
  process.cwd(),
  "..",
  "example",
  "components",
  "previews"
);

export function getPreviewComponentCode(name: string): string | null {
  try {
    const filePath = path.join(EXAMPLE_COMPONENTS_PATH, `${name}.tsx`);
    const content = readFileSync(filePath, "utf8");
    return content;
  } catch {
    return null;
  }
}
