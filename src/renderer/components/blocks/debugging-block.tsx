import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DebuggingBlockSvg from "@/renderer/assets/blocks/debugging-svg";
import DefaultBlock from "./default-block";

export type DebuggingCategory = "DEBUGGING";

const DebuggingBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent5">
      <DebuggingBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(DebuggingBlock);
