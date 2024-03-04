import { NodeProps } from "reactflow";
import { Nullish } from "@/renderer/types/util";
import { z } from "zod";
import { BlockDefinition } from "./manifest";

export type BlockParameterValue = Nullish<string | number | boolean>;

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
    v: Nullish<string>;
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
