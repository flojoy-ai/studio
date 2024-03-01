import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DataBlockSvg from "@/renderer/assets/blocks/data-svg";
import DefaultBlock from "./default-block";

export type DataCategory = "DATA" | "VISUALIZATION";

const DataNode = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props}>
      <DataBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(DataNode);
