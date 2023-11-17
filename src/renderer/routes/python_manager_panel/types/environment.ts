import { z } from "zod";

export const EnvironmentList = z.array(z.string());

export type EnvironmentList = z.infer<typeof EnvironmentList>;

export const EnvironmentDetail = z.object({
  channels: z.array(z.string()).nullable(),
  dependencies: z.array(z.string()).nullable(),
});

export type EnvironmentDetail = z.infer<typeof EnvironmentDetail>;
