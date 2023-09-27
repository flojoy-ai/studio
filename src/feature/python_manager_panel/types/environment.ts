import { z } from "zod";

export const Environments = z.array(z.string());

export type Environments = z.infer<typeof Environments>;
