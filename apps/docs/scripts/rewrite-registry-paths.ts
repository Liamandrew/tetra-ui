import { rewriteRegistryOutput } from "../lib/rewrite-registry-paths";

const main = async () => {
  await rewriteRegistryOutput();
};

main().catch((error: unknown) => {
  throw error instanceof Error ? error : new Error(String(error));
});
