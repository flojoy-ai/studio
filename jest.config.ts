import type { Config } from "@jest/types";
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
        lines: 90,
      },
    },
  };
};
