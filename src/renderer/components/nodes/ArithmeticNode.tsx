import { CustomNodeProps } from "@/renderer/types/node";
import { memo } from "react";
import DefaultNode from "./DefaultNode";

const operatorMap = {
  MULTIPLY: "×",
  ADD: "+",
  SUBTRACT: "-",
  DIVIDE: "÷",
  ABS: "|x|",
  POWER: "^",
  LOG: "log",
  FLOOR_DIVIDE: "//",
  REMAINDER: "%",
};

const ArithmeticNode = (props: CustomNodeProps) => {
  return (
    <DefaultNode width={72} height={72} {...props}>
      <h2 className="m-0 text-center font-sans text-4xl font-semibold tracking-wider text-accent1">
        {operatorMap[props.data.func]}
      </h2>
    </DefaultNode>
  );
};

export default memo(ArithmeticNode);
