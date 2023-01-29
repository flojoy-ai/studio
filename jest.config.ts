import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
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
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  };
};
