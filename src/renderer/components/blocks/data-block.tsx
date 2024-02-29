import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DataBlockSvg from "@/renderer/assets/blocks/data-svg";
import DefaultBlock from "./default-block";

const DataNode = (props: CustomNodeProps) => {
  return (
    <DefaultBlock
      {...props}
      SVGComponent={<DataBlockSvg blockName={props.data.func} />}
    />
  );
};

export default memo(DataNode);
