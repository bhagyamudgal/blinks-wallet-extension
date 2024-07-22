import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), nodePolyfills()],
    build: {
        outDir: "dist",
        assetsDir: ".",
        rollupOptions: {
            input: {
                index: "./index.html",
                background: "./src/background/index.ts",
                content: "./src/content/index.ts",
            },
            output: {
                entryFileNames: `[name].js`,
            },
        },
    },
});
