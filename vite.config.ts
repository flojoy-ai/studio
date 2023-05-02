import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@feature": path.resolve(__dirname, "src/feature"),
    },
  },
});
