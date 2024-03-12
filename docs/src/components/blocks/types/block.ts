import { type NodeProps } from "reactflow";
import { z } from "zod";
import { type BlockDefinition, type BlockParameterValue } from "./manifest";

export type CtrlData = Record<
  string,
  BlockDefinition["parameters"] extends infer T
    ? T extends Record<string, infer U>
      ? U & {
          functionName: string;
          param: string;
          value: BlockParameterValue;
        }
      : never
    : never
>;

export type BlockData = {
  id: string;
  label: string;
  type: string;
  func: string;
  path: string;
  running?: boolean;
  failed?: boolean;
  ctrls: CtrlData;
  initCtrls?: CtrlData;
  inputs?: BlockDefinition["inputs"];
  outputs?: BlockDefinition["outputs"];
  pip_dependencies?: {
    name: string;
    v: string | null;
  }[];
  invalid?: boolean;
};

export type TextData = {
  text: string;
};

export type BlockProps = NodeProps<BlockData>;

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
