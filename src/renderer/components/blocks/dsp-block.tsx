import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DspBlockSvg from "@/renderer/assets/blocks/dsp-svg";
import DefaultBlock from "./default-block";

export type DSPCategory = "DSP";

const DSPBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} variant="accent2">
      <DspBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(DSPBlock);
