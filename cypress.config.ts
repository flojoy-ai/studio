/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "aqkk6c",
  e2e: {
    video: false,
    baseUrl: "http://localhost:5391/",
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.ts")(on, config);
    },
    requestTimeout: 30000,
    numTestsKeptInMemory: 0,
    responseTimeout: 120e3,
    pageLoadTimeout: 100000,
  },
});

// require("@applitools/eyes-cypress")(module);
