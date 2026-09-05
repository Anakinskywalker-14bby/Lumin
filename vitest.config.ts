import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // `server-only` throws when imported outside a React Server Component.
      // In tests we substitute an empty module so the server modules that
      // guard themselves with it are still unit-testable.
      "server-only": path.resolve(__dirname, "test/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/svg-design.ts", // static path data, no logic
        "lib/supabase/**", // thin SDK client factory
        "lib/audit.ts", // needs a live Supabase write; integration-tested
        "lib/rate-limit.ts", // needs Redis; integration-tested
      ],
      // CI fails below these. Raise as coverage grows.
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
