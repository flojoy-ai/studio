import { Node, Edge } from "reactflow";
import { TextData, BlockData } from "@/renderer/types/block";
import { z } from "zod";

// TODO: Create an actual schema for this?
export const Project = z.object({
  name: z.string().optional(),
  rfInstance: z.object({
    nodes: z.custom<Node<BlockData>>().array(),
    edges: z.custom<Edge>().array(),
  }),
  textNodes: z.custom<Node<TextData>>().array().optional(),
});

export type Project = z.infer<typeof Project>;
