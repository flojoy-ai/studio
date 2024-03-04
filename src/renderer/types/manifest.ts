import { z } from "zod";

const nodeIoSchema = z.object({
  name: z.string(),
  id: z.string(),
  type: z.string(),
  desc: z.string().nullable(),
});

const nodeInputSchema = nodeIoSchema.extend({
  multiple: z.boolean(),
});
const nodeOutputSchema = nodeIoSchema;

const nodeParameterSchema = z.object({
  type: z.string(),
  default: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.undefined(),
  ]),
  options: z.union([z.string(), z.number()]).array().optional(),
  desc: z.string().nullable(),
  overload: z.record(z.string(), z.array(z.string())).nullable(),
});

export type ParamDefinition = z.infer<typeof nodeParameterSchema>;

const pipDependencySchema = z.object({
  name: z.string(),
  v: z.string().nullable(),
});

const blockDefinitionSchema = z.object({
  name: z.string(),
  key: z.string(),
  type: z.string(),
  inputs: z.array(nodeInputSchema).optional(),
  outputs: z.array(nodeOutputSchema).optional(),
  parameters: z.record(z.string(), nodeParameterSchema).optional(),
  init_parameters: z.record(z.string(), nodeParameterSchema).optional(),
  pip_dependencies: z.array(pipDependencySchema).optional(),
  children: z.null(),
});

export type BlockDefinition = z.infer<typeof blockDefinitionSchema>;
export type Leaf = BlockDefinition;

type BlockSection = {
  name: string;
  key?: string;
  children: (BlockSection | BlockDefinition)[];
};

const blockSectionSchema: z.ZodType<BlockSection> = z.object({
  name: z.string(),
  key: z.string().optional(),
  children: z
    .union([z.lazy(() => blockSectionSchema), blockDefinitionSchema])
    .array(),
});
export type ParentNode = BlockSection;

export const blockManifestSchema = z.object({
  name: z.literal("ROOT"),
  children: z.union([blockSectionSchema, blockDefinitionSchema]).array(),
});

export type BlockManifest = z.infer<typeof blockManifestSchema>;
export type RootNode = BlockManifest;

export interface LeafParentNode extends ParentNode {
  children: Leaf[];
}
export type RootChild = BlockManifest["children"][number];

export type TreeNode =
  | Leaf
  | ParentNode
  | LeafParentNode
  | RootNode
  | RootChild;

export const blockMetadataSchema = z.record(
  z.string(),
  z.object({
    metadata: z.string(),
    path: z.string(),
    full_path: z.string(),
  }),
);

export type BlockMetadata = z.infer<typeof blockMetadataSchema>;
