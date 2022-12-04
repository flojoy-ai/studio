import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video : false,
    baseUrl: "http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    requestTimeout : 30000,
    numTestsKeptInMemory: 0,
    responseTimeout : 120e3,
    pageLoadTimeout: 100000
  },
});
