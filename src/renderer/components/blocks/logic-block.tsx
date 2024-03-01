import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DefaultBlock from "./default-block";
import appendSvg from "@/renderer/assets/blocks/append-svg";
import { BlockLabel } from "../common/block-label";

const LogicBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} variant="accent3">
      {props.data.func === "APPEND" ? (
        appendSvg
      ) : (
        <BlockLabel label={props.data.func} variant="accent3" />
      )}
    </DefaultBlock>
  );
};

export default memo(LogicBlock);
