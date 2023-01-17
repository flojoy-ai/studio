import type { Config } from "@jest/types";
export default async (): Promise<Config.InitialOptions> => {
    return {
        preset: "ts-jest",
        displayName: {
            name: "flojoy unit-testing",
            color: "greenBright",
        },
        moduleNameMapper: {
            '^.+\\.(css|less)$': '<rootDir>/config/CSStub.js'
        },
        verbose: true,
        setupFiles: ["dotenv/config"],
        testMatch: ["**/**/*.test.{ts,tsx}"],
        testEnvironment: "jsdom",
        detectOpenHandles: true,
        collectCoverage: true,
        transform: {
            "^.+\\.tsx?$": "ts-jest",
            '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
                '<rootDir>/config/fileTransformer.js',
        },
        forceExit: true,
    };
};