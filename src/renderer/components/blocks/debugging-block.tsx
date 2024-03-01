import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DebuggingBlockSvg from "@/renderer/assets/blocks/debugging-svg";
import DefaultBlock from "./default-block";

const DSPBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock
      {...props}
      variant="accent5"
      SVGComponent={<DebuggingBlockSvg blockName={props.data.func} />}
    />
  );
};

export default memo(DSPBlock);
