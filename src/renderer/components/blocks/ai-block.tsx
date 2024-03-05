import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import AIBlockSvg from "@/renderer/assets/blocks/ai-svg";
import DefaultBlock from "./default-block";

export type AICategory = "AI_ML";

const AIBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} variant="accent6">
      <AIBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(AIBlock);
