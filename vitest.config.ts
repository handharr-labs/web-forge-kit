import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // `server-only` throws unless resolved under the react-server condition.
      // Tests run server code directly (node), so stub it to a no-op.
      "server-only": fileURLToPath(new URL("./test/stubs/empty.ts", import.meta.url)),
    },
  },
  test: {
    include: ["packages/*/src/**/*.test.ts", "playground/src/**/*.test.ts"],
    environment: "node",
  },
});
