/** @type {import("ts-jest").JestConfigWithTsJest} */
import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
const config = async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    displayName: {
      name: "flojoy unit-testing",
      color: "greenBright",
    },
    verbose: true,
    setupFiles: ["dotenv/config"],
    testMatch: ["**/**/*.test.{ts,tsx,js}"],
    testEnvironment: "jsdom",
    detectOpenHandles: true,
    collectCoverage: true,
    forceExit: true,
    clearMocks: true,
    coverageThreshold: {
      global: {
        lines: 0, // TODO: increamentially increase coverage threshold
      },
    },
    roots: ["<rootDir>"],
    modulePaths: ["."],
    moduleNameMapper: {
      "\\.(css|less)$": "<rootDir>/src/__tests__/config/CSSStub.js",
      ...pathsToModuleNameMapper(compilerOptions.paths),
    },
    transform: {
      "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
    },
    testPathIgnorePatterns: [
      "<rootDir>/node_modules/",
      "<rootDir>/src/__tests__/__utils__",
    ],
  };
};

export default config;
