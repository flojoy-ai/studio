import { CustomNodeProps } from "@/renderer/types";
import DefaultBlock from "../default-block";
import FnGeneratorsSvg from "@/renderer/assets/blocks/io/fn-generators-svg";

const FnGeneratorBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent4">
      <FnGeneratorsSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default FnGeneratorBlock;
