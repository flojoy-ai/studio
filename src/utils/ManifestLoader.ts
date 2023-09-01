import { fromZodError } from "zod-validation-error";
import { z, ZodError } from "zod";
import treeJSON from "@src/data/manifests-latest.json";

const leafSchema = z.object({
  name: z.string(),
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
  children: z.null(),
});

export type Leaf = z.infer<typeof leafSchema>;

export function createParentSchema<ChildType extends z.ZodTypeAny>(
  childSchema: ChildType,
) {
  return z.object({
    name: z.string(),
    key: z.optional(z.string()),
    type: z.optional(z.string()),
    children: z.array(childSchema),
  });
}
const parentSchema = createParentSchema<typeof leafSchema>(leafSchema);

export type ParentNode = z.infer<typeof parentSchema>;

export function createRootSchema<ElementType extends Zod.ZodTypeAny>(
  element: ElementType,
) {
  return z.object({
    name: z.literal("ROOT"),
    children: z.array(
      z.object({
        name: z.string(),
        key: z.optional(z.string()),
        type: z.optional(z.string()),
        children: z.array(createParentSchema(element)),
      }),
    ),
  });
}
const rootSchema = createRootSchema(leafSchema);

export type RootNode = z.infer<typeof rootSchema>;
export type RootChild = z.infer<typeof rootSchema>["children"][0];
let nodeSection: RootNode;
try {
  nodeSection = rootSchema.parse(treeJSON);
} catch (e) {
  if (e instanceof ZodError) {
    throw fromZodError(e);
  } else {
    throw e;
  }
}

export { nodeSection };


export function isLeaf(obj: TreeNode): obj is Leaf {
  return obj && obj.name && (obj as Leaf).key && (obj as Leaf).type && !obj.children;
}

export function isParentNode(obj: TreeNode): obj is ParentNode {
  return Boolean(obj && obj.name && Array.isArray(obj.children));
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
  return Boolean(obj?.name && (obj as RootChild)?.key && (obj as RootChild)?.type && Array.isArray(obj.children));
}

export type TreeNode = Leaf | ParentNode | LeafParentNode | RootNode | RootChild;