import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DataBlockSvg from "@/renderer/assets/blocks/data-svg";
import DefaultBlock from "./default-block";

export type DataCategory = "DATA" | "VISUALIZATION";

const DataNode = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} variant="accent2">
      <DataBlockSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(DataNode);
