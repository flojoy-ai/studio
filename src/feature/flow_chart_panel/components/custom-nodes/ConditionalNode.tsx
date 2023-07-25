import { memo } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import LogicNode from "./LogicNode";

export const ConditionalNode = ({ data, handleRemove }: CustomNodeProps) => {
  const operator = data.ctrls["operator_type"].value as string;

  return (
    <LogicNode data={data} handleRemove={handleRemove}>
      <h2 className="-rotate-45 font-sans text-2xl font-extrabold tracking-wider text-accent3">
        {operator}
      </h2>
    </LogicNode>
  );
};

export default memo(ConditionalNode);
