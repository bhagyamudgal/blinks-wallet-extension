import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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