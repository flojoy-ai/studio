import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    server: {
      port: 5391,
    },
    root: "./src",
    publicDir: resolve(__dirname, "public"),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/index.html"),
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    plugins: [nodePolyfills(), react()],
  },
});
