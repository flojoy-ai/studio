import { Position } from "reactflow";
import { CustomNodeProps } from "@src/types/node";
import { CustomHandle, HandleVariantProps } from "./CustomHandle";

type LogicHandleComponentProps = {
  data: CustomNodeProps["nodeProps"]["data"];
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
          position={Position.Bottom}
          type="target"
          param={inputs[0]}
          variant={variant}
          style={{ left: 3, bottom: -3 }}
        />
      </>
    );
  } else if (inputs.length === 2) {
    inputHandles = (
      <>
        <CustomHandle
          position={Position.Bottom}
          type="target"
          param={inputs[0]}
          variant={variant}
          style={{ bottom: -6 }}
        />
        <CustomHandle
          position={Position.Left}
          type="target"
          param={inputs[1]}
          variant={variant}
          style={{ left: -6 }}
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
          position={Position.Right}
          type="source"
          param={outputs[0]}
          variant={variant}
          style={{ right: -3, top: 3 }}
        />
      </>
    );
  } else if (outputs.length === 2) {
    outputHandles = (
      <>
        <CustomHandle
          position={Position.Top}
          type="source"
          param={outputs[0]}
          variant={variant}
          style={{
            top: -6,
          }}
        />
        <CustomHandle
          position={Position.Right}
          type="source"
          param={outputs[1]}
          variant={variant}
          style={{ right: -6 }}
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
