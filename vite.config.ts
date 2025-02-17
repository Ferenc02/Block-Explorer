import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: "src",

  plugins: [tailwindcss()],

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        nested: resolve(__dirname + "/wallet", "src/wallet/index.html"),
        newTransaction: resolve(
          __dirname + "/new-transaction",
          "src/new-transaction/index.html"
        ),
      },
    },
  },
});
