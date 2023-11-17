import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";
import eslint from "vite-plugin-eslint";
import istanbul from "vite-plugin-istanbul";
import path from "path";
import { rmSync } from "node:fs";

// https://vitejs.dev/config/
export default defineConfig(() => {
  rmSync("out", { recursive: true, force: true });

  const isRemote = process?.env?.DEPLOY_ENV === "remote";

  return {
    plugins: [
      react(),
      istanbul({
        include: ["src/**/*.ts", "src/**/*.tsx"],
      }),
      EnvironmentPlugin("all"),
      eslint({ emitWarning: false }),
    ],
    server: {
      host: isRemote ? "0.0.0.0" : "127.0.0.1",
      port: 5391,
      open: true,
      watch: {
        ignored: ["**/venv/**", "!**/node_modules/flojoy/**"],
      },
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src/renderer"),
        "@hooks": path.resolve(__dirname, "src/renderer/hooks"),
        "@feature": path.resolve(__dirname, "src/renderer/feature"),
        "@/components": path.resolve(__dirname, "src/renderer/components"),
        "@/assets": path.resolve(__dirname, "src/renderer/assets"),
        "@/lib": path.resolve(__dirname, "src/renderer/lib"),
      },
    },
    publicDir: path.resolve(__dirname, "public"),
    root: "./src",
    build: {
      outDir: "out",
    },
  };
});
