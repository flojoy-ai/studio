import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    video: false,
    requestTimeout : 30000,
    numTestsKeptInMemory: 0,
    responseTimeout : 120e3,
    pageLoadTimeout: 100000
  },
});
