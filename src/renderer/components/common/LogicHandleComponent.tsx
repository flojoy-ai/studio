import { Position } from "reactflow";
import { CustomNodeProps } from "@src/types/node";
import { CustomHandle, HandleVariantProps } from "./CustomHandle";

type LogicHandleComponentProps = {
  data: CustomNodeProps["data"];
} & HandleVariantProps;

export const LogicHandleComponent = ({
  data,
  variant,
}: LogicHandleComponentProps) => {
  const inputs = data.inputs;
  const outputs = data.outputs;

  let inputHandles: React.ReactNode;
  let outputHandles: React.ReactNode;

  // Have to hard code the possible positions of the outputHandles
  // because of the weird shape of the logic nodes

  if (!inputs || inputs.length === 0) {
    inputHandles = <></>;
  } else if (inputs.length === 1) {
    inputHandles = (
      <>
        <CustomHandle
          nodeId={data.id}
          position={Position.Bottom}
          type="target"
          param={inputs[0]}
          variant={variant}
          style={{ left: 3, bottom: -6 }}
        />
      </>
    );
  } else if (inputs.length === 2) {
    inputHandles = (
      <>
        <CustomHandle
          nodeId={data.id}
          position={Position.Bottom}
          type="target"
          param={inputs[0]}
          variant={variant}
          style={{ bottom: -9 }}
        />
        <CustomHandle
          nodeId={data.id}
          position={Position.Left}
          type="target"
          param={inputs[1]}
          variant={variant}
          style={{ left: -9 }}
        />
      </>
    );
  }

  if (!outputs || outputs.length === 0) {
    outputHandles = <></>;
  } else if (outputs.length === 1) {
    outputHandles = (
      <>
        <CustomHandle
          nodeId={data.id}
          position={Position.Right}
          type="source"
          param={outputs[0]}
          variant={variant}
          style={{ right: -6, top: 3 }}
        />
      </>
    );
  } else if (outputs.length === 2) {
    outputHandles = (
      <>
        <CustomHandle
          nodeId={data.id}
          position={Position.Top}
          type="source"
          param={outputs[0]}
          variant={variant}
          style={{
            top: -9,
          }}
        />
        <CustomHandle
          nodeId={data.id}
          position={Position.Right}
          type="source"
          param={outputs[1]}
          variant={variant}
          style={{ right: -9 }}
        />
      </>
    );
  }

  return (
    <>
      {inputHandles}
      {outputHandles}
    </>
  );
};
