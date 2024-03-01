import { CustomNodeProps } from "@/renderer/types/node";
import { memo } from "react";
import DefaultBlock from "./default-block";
import TransformSvg from "@/renderer/assets/blocks/triangle-svg";

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

const ArithmeticBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock
      {...props}
      labelPosition="left"
      width={"fit-content"}
      className={"!border-none !p-0"}
    >
      <TransformSvg
        operatorString={operatorMap[props.data.func]}
        variant="accent2"
      />
    </DefaultBlock>
  );
};

export default memo(ArithmeticBlock);
