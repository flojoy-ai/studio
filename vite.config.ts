import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";
import eslint from "vite-plugin-eslint";
import istanbul from "vite-plugin-istanbul";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    istanbul({
      include: ["src/**/*.ts", "src/**/*.tsx"],
    }),
    react(),
    EnvironmentPlugin("all"),
    eslint({
      emitWarning: false,
    }),
  ],
  server: {
    port: 3000,
    watch: {
      ignored: ["**/venv/**"],
    },
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@feature": path.resolve(__dirname, "src/feature"),
      "@component": path.resolve(__dirname, "src/component"),
    },
  },
});
