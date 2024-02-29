import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DspBlockSvg from "@/renderer/assets/blocks/dsp-svg";
import DefaultBlock from "./default-block";

const DSPBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock
      {...props}
      SVGComponent={<DspBlockSvg blockName={props.data.func} />}
    />
  );
};

export default memo(DSPBlock);
