import { z } from "zod";

export type EnvVar = {
  key: string;
  value: string;
};

export const EnvVar = z.object({
  key: z.string(),
  value: z.string(),
});
