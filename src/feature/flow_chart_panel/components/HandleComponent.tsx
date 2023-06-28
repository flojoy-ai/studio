import { Fragment } from "react";
import { Handle, HandleType, Position } from "reactflow";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { v4 as uuidV4 } from "uuid";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";

const HandleComponent = ({ data }: { data: CustomNodeProps["data"] }) => {
  const outputs = data.outputs ?? [];
  const inputs = data.inputs ?? [];

  return (
    <Fragment>
      {/**
       *
       * Rendering source handle.
       *  If it has multiple handles render them
       *  otherwise render one source handle
       *
       */}
      {inputs.map((param, i) => (
        <Handle
          key={`input-${data.id}-${param.name}`}
          position={Position.Left}
          type="target"
          style={{
            left: -15,
            top: 30 * i,
          }}
          id={param.id}
        >
          {param.name !== "default" ? param.name : ""}
        </Handle>
      ))}
      {outputs.map((param, i) => (
        <Handle
          key={`output-${data.id}-${param.name}`}
          position={Position.Right}
          type="source"
          style={{
            right: -15,
          }}
          id={param.id}
        >
          {param.name !== "default" ? param.name : ""}
        </Handle>
      ))}
      {/**
       *
       * Rendering target handle.
       *  If it has multiple handles render them
       *  otherwise render one target handle
       *
       */}
    </Fragment>
  );
};

export default HandleComponent;
