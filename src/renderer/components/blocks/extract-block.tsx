import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import ExtractSvg from "@/renderer/assets/blocks/extract-svg";
import DefaultBlock from "./default-block";

const ExtractBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props}>
      <ExtractSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(ExtractBlock);
