import { CustomNodeProps } from "@/renderer/types";
import DefaultBlock from "./default-block";
import LoadSvg from "@/renderer/assets/blocks/load-svg";

const LoadBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props}>
      <div className="p-3">
        <LoadSvg blockName={props.data.func} />
      </div>
    </DefaultBlock>
  );
};

export default LoadBlock;
