import { type BlockProps } from "./types/block";
import { memo } from "react";
import DefaultBlock from "./default-block";
import TransformSvg from "@/assets/blocks/triangle-svg";

export type MathCategory = "MATH";

const operatorMap: Record<string, string> = {
  MULTIPLY: "×",
  ADD: "+",
  SUBTRACT: "-",
  DIVIDE: "÷",
  ABS: "|x|",
  POWER: "^",
  LOG: "log",
  FLOOR_DIVIDE: "//",
  REMAINDER: "%",
  INTEGRATE: "∫",
  DIFFERENTIATE: "∂",
  DOUBLE_DEFINITE_INTEGRAL: "∬",
  DOUBLE_INDEFINITE_INTEGRAL: "∬",
};

const MathBlock = (props: BlockProps) => {
  return (
    <DefaultBlock
      {...props}
      labelPosition="left"
      width={"fit-content"}
      className={"!border-none !p-0"}
      variant="accent1"
    >
      <TransformSvg
        operatorString={operatorMap[props.data.func]}
        variant="accent1"
      />
    </DefaultBlock>
  );
};

export default memo(MathBlock);
