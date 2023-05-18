import manifests from "@src/data/manifests-latest.json";
import { z } from "zod";
type FunctionParametersType = {
  [key: string]: {
    [key: string]: {
      type: string;
      default: string | number;
      options?: string[];
    };
  };
};

const paramsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.object({
      type: z.string(),
      default: z.union([z.string(), z.number()]),
      options: z.optional(z.array(z.string())),
    })
  )
);

type FuncParamsType = z.infer<typeof paramsSchema>;

console.log(manifests.parameters);
export const FUNCTION_PARAMETERS: FuncParamsType = paramsSchema.parse(
  manifests.parameters
);
