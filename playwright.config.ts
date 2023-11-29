import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    trace: {
      mode: "on",
      sources: true,
    },
  },
});
