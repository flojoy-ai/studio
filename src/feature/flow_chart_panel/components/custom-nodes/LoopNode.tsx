import { memo } from "react";
import { Position } from "reactflow";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import { CustomHandle } from "../CustomHandle";
import LogicNode from "./LogicNode";

export const LoopNode = ({ data, handleRemove }: CustomNodeProps) => {
  if (!data.inputs || !data.outputs) {
    throw new Error("LoopNode must have 1 inputs and 2 outputs");
  }

  const input = data.inputs[0];
  const output1 = data.outputs[0];
  const output2 = data.outputs[1];

  return (
    <LogicNode data={data} handleRemove={handleRemove}>
      <h2 className="font-sans font-extrabold text-2xl tracking-wider text-accent3 -rotate-45">
        {data.label}
      </h2>
      <CustomHandle
        position={Position.Bottom}
        type="target"
        id={input.id}
        colorClass="!border-accent3"
        style={{ left: 3, bottom: -3 }}
      />

      <CustomHandle
        position={Position.Top}
        type="source"
        id={output1.id}
        colorClass="!border-accent3"
        style={{
          top: -6,
        }}
      />
      <CustomHandle
        position={Position.Right}
        type="target"
        id={output2.id}
        colorClass="!border-accent3"
        style={{ right: -6 }}
      />
    </LogicNode>
  );
};

export default memo(LoopNode);
