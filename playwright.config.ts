import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    video: {
      mode: "on",
      size: {
        height: 720,
        width: 1080,
      },
    },
    screenshot: {
      mode: "on",
    },
  },
});
