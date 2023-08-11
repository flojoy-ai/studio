import { fromZodError } from "zod-validation-error";
import { z, ZodError } from "zod";
import nodeSectionJSON from "@src/data/manifests-latest.json";

const NodeElement = z.object({
  name: z.string(),
  entryType: z.literal("leaf").default("leaf"),
  key: z.string(),
  type: z.string(),
  inputs: z.optional(
    z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        type: z.string(),
        multiple: z.boolean(),
        desc: z.nullable(z.string()),
      }),
    ),
  ),
  outputs: z.optional(
    z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        type: z.string(),
        desc: z.nullable(z.string()),
      }),
    ),
  ),
  parameters: z.optional(
    z.record(
      z.string(),
      z.object({
        type: z.string(),
        default: z.optional(
          z.union([z.string(), z.number(), z.boolean(), z.null()]),
        ),
        options: z.optional(z.array(z.string())),
        desc: z.nullable(z.string()),
      }),
    ),
  ),
  init_parameters: z.optional(
    z.record(
      z.string(),
      z.object({
        type: z.string(),
        default: z.optional(
          z.union([z.string(), z.number(), z.boolean(), z.null()]),
        ),
        options: z.optional(z.array(z.string())),
        desc: z.nullable(z.string()),
      }),
    ),
  ),
  pip_dependencies: z.optional(
    z.array(z.object({ name: z.string(), v: z.optional(z.string()) })),
  ),
  ui_component_id: z.optional(z.string()),
  // children: z.null(),
});

export type NodeElement = z.infer<typeof NodeElement>;

const NodeSection = z.object({
  name: z.literal("ROOT"),
  entryType: z.literal("section").default("section"),
  children: z.array(
    z.object({
      name: z.string(),
      entryType: z.literal("section").default("section"),
      key: z.string(),
      type: z.optional(z.string()),
      children: z.array(
        z.union([
          NodeElement,
          z.object({
            name: z.string(),
            entryType: z.literal("section").default("section"),
            key: z.string(),
            type: z.optional(z.string()),
            children: z.array(
              z.union([
                NodeElement,
                z.object({
                  name: z.string(),
                  entryType: z.literal("section").default("section"),
                  key: z.string(),
                  type: z.optional(z.string()),
                  children: NodeElement,
                }),
              ]),
            ),
          }),
        ]),
      ),
    }),
  ),
});

export type NodeSection = z.infer<typeof NodeSection>;

let nodeSection: NodeSection;

try {
  nodeSection = NodeSection.parse(nodeSectionJSON);
} catch (e) {
  if (e instanceof ZodError) {
    throw fromZodError(e);
  } else {
    throw e;
  }
}

export { nodeSection };
