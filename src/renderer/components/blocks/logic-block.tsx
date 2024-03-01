import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DefaultBlock from "./default-block";
import appendSvg from "@/renderer/assets/blocks/append-svg";

const LogicBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent3">
      <>{props.data.func === "APPEND" ? appendSvg : undefined}</>
    </DefaultBlock>
  );
};

export default memo(LogicBlock);
