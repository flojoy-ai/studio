import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";
import eslint from "vite-plugin-eslint";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin("all"), eslint()],
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
