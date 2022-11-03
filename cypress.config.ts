import { defineConfig } from "cypress";
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    video: false,
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
    },
    requestTimeout : 30000,
    numTestsKeptInMemory: 0,
    responseTimeout : 120e3,
    pageLoadTimeout: 100000
  },
});
