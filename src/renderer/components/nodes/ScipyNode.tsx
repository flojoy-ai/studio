import { memo, useState } from "react";
import clsx from "clsx";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { CustomNodeProps } from "@src/types/node";
import { ScipySvg } from "@assets/ArithmeticSVG";
import HandleComponent from "@components/common/HandleComponent";
import NodeInput from "@components/common/NodeInput";
import { useNodeStatus } from "@src/hooks/useNodeStatus";

const NumpyNode = ({ selected, data }: CustomNodeProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          "flex h-40 w-60 items-center justify-center rounded-2xl border-2 border-solid border-blue-500 bg-accent1/5",
          { "shadow-around shadow-blue-500": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
        onDoubleClick={() => setIsRenamingTitle(true)}
      >
        <div className="flex flex-col items-center">
          <ScipySvg className="h-16 w-16" />
          {isRenamingTitle ? (
            <NodeInput
              title={data.label}
              id={data.id}
              setIsRenamingTitle={setIsRenamingTitle}
            />
          ) : (
            <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
              <span>sp.</span>
              <span className="font-extrabold">{data.label}</span>
            </h2>
          )}
        </div>
        <HandleComponent data={data} variant="blue" />
      </div>
    </NodeWrapper>
  );
};

export default memo(NumpyNode);
