import { BlockProps } from "@/renderer/types/node";
import { memo } from "react";
import DefaultBlock from "./DefaultBlock";

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

const ArithmeticBlock = (props: BlockProps) => {
  return (
    <DefaultBlock width={72} height={72} {...props}>
      <h2 className="m-0 text-center font-sans text-4xl font-semibold tracking-wider text-accent1">
        {operatorMap[props.data.func]}
      </h2>
    </DefaultBlock>
  );
};

export default memo(ArithmeticBlock);
