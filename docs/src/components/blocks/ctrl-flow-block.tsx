import { memo } from "react";
import DefaultBlock from "./default-block";
import { BlockLabel } from "./block-label";
import TransformSvg from "@/assets/blocks/triangle-svg";
import AppendSvg from "@/assets/blocks/APPEND.svg?react";
import type { NodeProps } from "reactflow";

export type CtrlFlowCategory = "CONTROL_FLOW" | "CONDITIONALS";

const CtrlFlowBlock = (props: NodeProps) => {
  if (props.type === "CONDITIONALS") {
    return <ConditionalBlock {...props} />;
  }
  return (
    <DefaultBlock {...props} variant="accent3">
      {props.data.func === "APPEND" ? (
        <AppendSvg />
      ) : (
        <BlockLabel label={props.data.func} variant="accent3" />
      )}
    </DefaultBlock>
  );
};

const ConditionalBlock = (props: NodeProps) => {
  const { data } = props;
  const operator = data.ctrls["operator_type"].value as string;

  return (
    <DefaultBlock
      {...props}
      variant="accent3"
      labelPosition="left"
      width={"fit-content"}
      className="!border-none !p-0"
    >
      <TransformSvg operatorString={operator} variant="accent3" />
    </DefaultBlock>
  );
};

export default memo(CtrlFlowBlock);
