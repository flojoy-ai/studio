import { CustomNodeProps } from "@/renderer/types";
import DefaultBlock from "../default-block";
import RoboticsSvg from "@/renderer/assets/blocks/hardware/robotics-svg";

const RoboticBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent4">
      <RoboticsSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default RoboticBlock;
