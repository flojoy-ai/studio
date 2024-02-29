import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import TransformSvg from "@/renderer/assets/blocks/triangle-svg";
import DefaultBlock from "./default-block";

export const ConditionalNode = (props: CustomNodeProps) => {
  const { data } = props;
  const operator = data.ctrls["operator_type"].value as string;

  return (
    <DefaultBlock
      {...props}
      variant="accent3"
      labelPosition="left"
      width={"fit-content"}
      className="!border-none !p-0"
      SVGComponent={
        <TransformSvg operatorString={operator} variant="accent3" />
      }
    />
  );
};

export default memo(ConditionalNode);
