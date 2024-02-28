import { z } from "zod";

const nodeIoSchema = z.object({
  name: z.string(),
  id: z.string(),
  type: z.string(),
  desc: z.nullable(z.string()),
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
  options: z.optional(z.array(z.string())),
  desc: z.nullable(z.string()),
  overload: z.nullable(z.record(z.string(), z.array(z.string()))),
});

const pipDependencySchema = z.object({
  name: z.string(),
  v: z.optional(z.string()),
});

const leafSchema = z.object({
  name: z.string(),
  key: z.string(),
  type: z.string(),
  inputs: z.optional(z.array(nodeInputSchema)),
  outputs: z.optional(z.array(nodeOutputSchema)),
  parameters: z.optional(z.record(z.string(), nodeParameterSchema)),
  init_parameters: z.optional(z.record(z.string(), nodeParameterSchema)),
  pip_dependencies: z.optional(z.array(pipDependencySchema)),
  children: z.null(),
});

export type Leaf = z.infer<typeof leafSchema>;

const parentSchema = z.object({
  name: z.string(),
  key: z.optional(z.string()),
  children: z.array(z.union([leafSchema, z.lazy(() => parentSchema)])),
});
export type ParentNode = z.infer<typeof parentSchema>;

const nodeSchema = z.union([parentSchema, leafSchema]);

const rootSchema = z.object({
  name: z.literal("ROOT"),
  children: z.array(nodeSchema),
});

export type RootNode = z.infer<typeof rootSchema>;
export type BlockManifest = RootNode;
export type RootChild = z.infer<typeof rootSchema>["children"][0];

export const validateRootSchema = (schema: RootNode) => {
  return rootSchema.safeParse(schema);
};

export function isLeaf(obj: TreeNode): obj is Leaf {
  return Boolean(
    obj?.name && (obj as Leaf).key && (obj as Leaf).type && !obj.children,
  );
}

export function isParentNode(obj: TreeNode): obj is ParentNode {
  return Boolean(obj?.name && Array.isArray(obj.children));
}
export interface LeafParentNode extends ParentNode {
  children: Leaf[];
}
export function isLeafParentNode(obj: TreeNode): obj is LeafParentNode {
  return (
    obj &&
    Array.isArray(obj.children) &&
    obj.children.every((child) => isLeaf(child))
  );
}

export function isRoot(obj: TreeNode): obj is RootNode {
  return obj && obj.name === "ROOT";
}

export function isRootChild(obj: TreeNode): obj is RootChild {
  return Boolean(
    obj?.name && (obj as RootChild)?.key && Array.isArray(obj.children),
  );
}

export type TreeNode =
  | Leaf
  | ParentNode
  | LeafParentNode
  | RootNode
  | RootChild;
