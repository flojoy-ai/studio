import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import AIBlockSvg from "@/renderer/assets/blocks/ai-svg";
import DefaultBlock from "./default-block";

const AIBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent6">
      <AIBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(AIBlock);
