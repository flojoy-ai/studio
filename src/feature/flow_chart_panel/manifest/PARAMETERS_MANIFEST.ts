import manifests from "@src/data/manifests-latest.json";
import { z } from "zod";

const paramsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.object({
      type: z.string(),
      default: z.union([z.string(), z.number(), z.boolean()]),
      options: z.optional(z.array(z.string())),
    })
  )
);

type FuncParamsType = z.infer<typeof paramsSchema>;

export const FUNCTION_PARAMETERS: FuncParamsType = paramsSchema.parse(
  manifests.parameters
);
