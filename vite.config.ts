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
  const isRemote = process.env.DEPLOY_ENV === "remote";

  return {
    plugins: [
      react(),
      istanbul({
        include: ["src/**/*.ts", "src/**/*.tsx"],
      }),
      EnvironmentPlugin("all"),
      eslint({ emitWarning: false }),
      !isRemote &&
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
                sourcemap: sourcemap ? "inline" : undefined,
                minify: isBuild,
                rollupOptions: {
                  input: {
                    main: "electron/main/index.ts",
                    preload: `electron/preload/index${
                      !isBuild ? "-dev" : ""
                    }.ts`,
                  },
                  output: {
                    dir: "dist-electron",
                    entryFileNames: (chunk) => {
                      const formatPath = chunk.facadeModuleId.replace(
                        /\\/g,
                        "/",
                      );
                      const split = formatPath.split("/");
                      const fileName = split[split.length - 1].split(".")[0];
                      return `${chunk.name}/${fileName}.js`;
                    },
                  },
                },
              },
            },
          },
        ]),
      // Use Node.js API in the Renderer-process
      !isRemote && renderer(),
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
      port: 5391,
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
    base: "./",
    build: {
      outDir: "dist-electron/studio",
    },
  };
});
