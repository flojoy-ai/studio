import { fromZodError } from "zod-validation-error";
import { z, ZodError } from "zod";
import nodeSectionJSON from "@src/data/manifests-latest.json";

const nodeElementSchema = z.object({
  name: z.string(),
  key: z.string(),
  type: z.string(),
  inputs: z.optional(
    z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        type: z.string(),
        multiple: z.optional(z.boolean()),
        desc: z.nullable(z.string()),
      })
    )
  ),
  outputs: z.optional(
    z.array(z.object({ name: z.string(), id: z.string(), type: z.string() }))
  ),
  parameters: z.optional(
    z.record(
      z.string(),
      z.object({
        type: z.string(),
        default: z.optional(
          z.union([z.string(), z.number(), z.boolean(), z.null()])
        ),
        options: z.optional(z.array(z.string())),
        desc: z.nullable(z.string()),
      })
    )
  ),
  pip_dependencies: z.optional(
    z.array(z.object({ name: z.string(), v: z.optional(z.string()) }))
  ),
  ui_component_id: z.optional(z.string()),
  children: z.null(),
});

export type NodeElement = z.infer<typeof nodeElementSchema>;

export function createSubCategorySchema<ChildType extends z.ZodTypeAny>(
  childSchema: ChildType
) {
  return z.object({
    name: z.string(),
    key: z.optional(z.string()),
    type: z.optional(z.string()),
    children: z.array(childSchema),
  });
}
const subCategorySchema =
  createSubCategorySchema<typeof nodeElementSchema>(nodeElementSchema);

export type SubCategory = z.infer<typeof subCategorySchema>;

export function createSectionSchema<ElementType extends Zod.ZodTypeAny>(
  element: ElementType
) {
  return z.object({
    name: z.literal("ROOT"),
    children: z.array(
      z.object({
        name: z.string(),
        key: z.optional(z.string()),
        type: z.optional(z.string()),
        children: z.array(createSubCategorySchema(element)),
      })
    ),
  });
}
const nodeSectionSchema = createSectionSchema(nodeElementSchema);

export type NodeSection = z.infer<typeof nodeSectionSchema>;
let nodeSection: NodeSection;
try {
  nodeSection = nodeSectionSchema.parse(nodeSectionJSON);
} catch (e) {
  if (e instanceof ZodError) {
    throw fromZodError(e);
  } else {
    throw e;
  }
}

export { nodeSection };
