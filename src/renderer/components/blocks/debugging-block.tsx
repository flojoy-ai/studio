import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DebuggingBlockSvg from "@/renderer/assets/blocks/debugging-svg";
import DefaultBlock from "./default-block";

export type DebuggingCategory = "DEBUGGING";

const DebuggingBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} variant="accent5">
      <DebuggingBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(DebuggingBlock);
