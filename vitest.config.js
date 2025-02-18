import { defineConfig } from "vite";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**"],
    environment: "happy-dom",
  },
});
