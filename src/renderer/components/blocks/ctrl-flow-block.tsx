import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DefaultBlock from "./default-block";
import AppendSvg from "@/renderer/assets/blocks/APPEND.svg?react";
import { BlockLabel } from "@/renderer/components/common/block-label";
import TransformSvg from "@/renderer/assets/blocks/triangle-svg";

export type CtrlFlowCategory = "CONTROL_FLOW" | "CONDITIONALS";

const CtrlFlowBlock = (props: BlockProps) => {
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

const ConditionalBlock = (props: BlockProps) => {
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
