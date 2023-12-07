import { defineConfig } from "@playwright/test";

export default defineConfig({
  workers: 1,
  use: {
    trace: {
      mode: "retain-on-failure",
      sources: true,
    },
  },
});
