import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {},

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  client: {
    VITE_BACKEND_PORT: z.number().int().default(5392),
    VITE_BACKEND_HOST: z.string().default("127.0.0.1"),
    VITE_STUDIO_REPO: z
      .string()
      .url()
      .default("https://github.com/flojoy-ai/studio/blob/main"),
    VITE_DOCS_LINK: z.string().url().default("https://docs.flojoy.ai"),
    VITE_REQUEST_BLOCK_URL: z
      .string()
      .url()
      .default("https://toqo276pj36.typeform.com/to/F5rSHVu1"),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
