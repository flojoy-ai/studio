import { memo, useState } from "react";
import clsx from "clsx";
import { BlockProps } from "@/renderer/types/block";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import { NumpySvg } from "@/renderer/assets/ArithmeticSVG";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import BlockLabelInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";

const NumpyBlock = ({ selected, data }: BlockProps) => {
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
          <NumpySvg className="h-16 w-16" />
          {isRenamingTitle ? (
            <BlockLabelInput
              title={data.label}
              id={data.id}
              setIsRenamingTitle={setIsRenamingTitle}
            />
          ) : (
            <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
              <span>np.</span>
              <span className="font-extrabold">{data.label}</span>
            </h2>
          )}
        </div>
        <HandleComponent data={data} variant="blue" />
      </div>
    </NodeWrapper>
  );
};

export default memo(NumpyBlock);
