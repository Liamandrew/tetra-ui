import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  rewriteFiles,
  rewriteRegistryImports,
  toRegistryTarget,
  toSafeRegistryPath,
} from "./rewrite-registry-paths";

describe("toSafeRegistryPath", () => {
  it("rewrites nested component paths under the ui prefix", () => {
    assert.equal(
      toSafeRegistryPath(
        "../../packages/tetra-ui/src/components/native-date-select/index.ts"
      ),
      "ui/native-date-select/index.ts"
    );
  });

  it("rewrites hook paths under the hooks prefix", () => {
    assert.equal(
      toSafeRegistryPath(
        "../../packages/tetra-ui/src/hooks/use-relative-position.ts"
      ),
      "hooks/use-relative-position.ts"
    );
  });
});

describe("toRegistryTarget", () => {
  it("maps rewritten paths onto the matching alias placeholder", () => {
    assert.equal(
      toRegistryTarget("ui/native-date-select/index.ts"),
      "@ui/native-date-select/index.ts"
    );
    assert.equal(
      toRegistryTarget("hooks/use-relative-position.ts"),
      "@hooks/use-relative-position.ts"
    );
  });
});

describe("rewriteRegistryImports", () => {
  it("maps internal registry aliases onto consumer paths", () => {
    assert.equal(
      rewriteRegistryImports(
        [
          'import { Button } from "@/registry/ui/button";',
          'import { cn } from "@/registry/lib/utils";',
          'import { useRelativePosition } from "@/registry/hooks/use-relative-position";',
        ].join("\n")
      ),
      [
        'import { Button } from "@/components/ui/button";',
        'import { cn } from "@/lib/utils";',
        'import { useRelativePosition } from "@/hooks/use-relative-position";',
      ].join("\n")
    );
  });
});

describe("rewriteFiles", () => {
  it("adds alias targets so nested ui files keep their directories", () => {
    const files = rewriteFiles([
      {
        path: "../../packages/tetra-ui/src/components/native-date-select/index.ts",
        type: "registry:ui",
      },
      {
        path: "../../packages/tetra-ui/src/components/native-date-select/native-date-select.tsx",
        type: "registry:ui",
      },
    ]);

    assert.deepEqual(files, [
      {
        path: "ui/native-date-select/index.ts",
        target: "@ui/native-date-select/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/native-date-select/native-date-select.tsx",
        target: "@ui/native-date-select/native-date-select.tsx",
        type: "registry:ui",
      },
    ]);
  });

  it("rewrites internal registry imports in file content", () => {
    const files = rewriteFiles([
      {
        path: "../../packages/tetra-ui/src/components/button.tsx",
        type: "registry:ui",
        content:
          'import { cn } from "@/registry/lib/utils";\nimport { Slot } from "@/registry/ui/slot";\n',
      },
    ]);

    assert.deepEqual(files, [
      {
        path: "ui/button.tsx",
        target: "@ui/button.tsx",
        type: "registry:ui",
        content:
          'import { cn } from "@/lib/utils";\nimport { Slot } from "@/components/ui/slot";\n',
      },
    ]);
  });

  it("preserves an explicit target", () => {
    const files = rewriteFiles([
      {
        path: "../../packages/tetra-ui/src/components/button.tsx",
        target: "~/custom/button.tsx",
        type: "registry:ui",
      },
    ]);

    assert.deepEqual(files, [
      {
        path: "ui/button.tsx",
        target: "~/custom/button.tsx",
        type: "registry:ui",
      },
    ]);
  });
});
