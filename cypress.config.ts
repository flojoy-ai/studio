import { defineConfig } from "cypress";
const fs = require("fs");
const path = require("path");

export default defineConfig({
  projectId: "aqkk6c",

  e2e: {
    video: false,
    baseUrl: "http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        readExampleFiles() {
          // Get a list of all files in the /public directory
          const files = fs.readdirSync(
            path.join(__dirname, "/public/example-apps")
          );

          // Filter the list of files to only include .txt files
          const txtFiles = files.filter((file: string) =>
            file.endsWith(".txt")
          );

          // Read the contents of each .txt file, parse it as JSON, and store it in an array
          const jsonObjects: any[] = [];
          for (const txtFile of txtFiles) {
            const txtFilePath = path.join(
              __dirname,
              "/public/example-apps",
              txtFile
            );
            const txtFileContents = fs.readFileSync(txtFilePath, "utf-8");
            const jsonObject = JSON.parse(txtFileContents);
            jsonObjects.push({ title: txtFile, data: jsonObject });
          }

          // Return the array of JSON objects
          return jsonObjects;
        },
      });
    },
    requestTimeout: 30000,
    numTestsKeptInMemory: 0,
    responseTimeout: 120e3,
    pageLoadTimeout: 100000,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});

require("@applitools/eyes-cypress")(module);
