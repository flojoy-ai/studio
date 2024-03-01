import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DefaultBlock from "../default-block";
import HardwareSvg from "@/renderer/assets/blocks/hardware/hardware-svg";

const HardwareBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent4">
      <HardwareSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(HardwareBlock);
