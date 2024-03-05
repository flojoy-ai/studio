import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import LogicBlock from "./LogicBlock";

export const ConditionalBlock = (props: BlockProps) => {
  const { data } = props;
  const operator = data.ctrls["operator_type"].value as string;

  return (
    <LogicBlock {...props}>
      <h2 className="m-0 -rotate-45 text-center font-sans text-2xl font-extrabold tracking-wider text-accent3">
        {operator}
      </h2>
    </LogicBlock>
  );
};

export default memo(ConditionalBlock);
