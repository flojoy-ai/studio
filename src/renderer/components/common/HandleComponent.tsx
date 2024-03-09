import { Position } from "reactflow";
import { CustomHandle, HandleVariantProps } from "./CustomHandle";
import { BlockProps } from "@/renderer/types/block";

const HandleComponent = ({
  data,
  variant,
}: {
  data: BlockProps["data"];
} & HandleVariantProps) => {
  const outputs = data.outputs ?? [];
  const inputs = data.inputs ?? [];

  return (
    <>
      <div className="absolute -left-2 top-0 flex h-full flex-col justify-evenly">
        {inputs.map((param) => (
          <div
            className="relative flex items-center"
            key={`input-${data.id}-${param.name}`}
          >
            <CustomHandle
              className="left-0"
              position={Position.Left}
              type="target"
              param={param}
              nodeId={data.id}
              variant={variant}
            />
          </div>
        ))}
      </div>

      <div className="absolute -right-2 top-0 flex h-full flex-col justify-evenly">
        {outputs.map((param) => (
          <div
            className="relative flex items-center"
            key={`input-${data.id}-${param.name}`}
          >
            <CustomHandle
              className="right-0"
              position={Position.Right}
              type="source"
              param={param}
              nodeId={data.id}
              variant={variant}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default HandleComponent;
