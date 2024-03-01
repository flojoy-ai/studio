import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import TypeCasting from "@/renderer/assets/blocks/type-casting";
import DefaultBlock from "./default-block";

const TypeCastingBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} showLabel={false}>
      <TypeCasting blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(TypeCastingBlock);
