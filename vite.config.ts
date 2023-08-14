import { defineConfig, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";
import eslint from "vite-plugin-eslint";
import istanbul from "vite-plugin-istanbul";
import path from "path";

import { rmSync } from "node:fs";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    plugins: [
      react(),
      istanbul({
        include: ["src/**/*.ts", "src/**/*.tsx"],
      }),
      EnvironmentPlugin("all"),
      eslint({ emitWarning: true }),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: "electron/main/index.ts",
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ "[startup] Electron App",
              );
            } else if (process.env.FLOJOY_USE_WAYLAND) {
              options.startup([
                ".",
                "--no-sandbox",
                "--enable-features=UseOzonePlatform",
                "--ozone-platform=wayland",
              ]);
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
        {
          entry: "electron/preload/index.ts",
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined, // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
      {
        name: "watch-node-modules",
        configureServer: (server: ViteDevServer): void => {
          server.watcher.options = {
            ...server.watcher.options,
            ignored: [/node_modules\/(?!flojoy).*/, "**/.git/**", "**/venv/**"],
          };
        },
      },
    ],
    server: {
      port: 3000,
      open: false,
      watch: {
        ignored: ["**/venv/**", "!**/node_modules/flojoy/**"],
      },
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@feature": path.resolve(__dirname, "src/feature"),
        "@/components": path.resolve(__dirname, "src/components"),
        "@/assets": path.resolve(__dirname, "src/assets"),
        "@/lib": path.resolve(__dirname, "src/lib"),
      },
    },
  };
});
