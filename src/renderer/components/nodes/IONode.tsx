import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@/renderer/types/node";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import { DodecahedronSVG } from "@/renderer/assets/DodecahedronSVG";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import NodeInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";

const IONode = ({ selected, data }: CustomNodeProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          "flex h-48 w-48 flex-col items-center",
          { "shadow-around shadow-accent4": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <DodecahedronSVG />

        {isRenamingTitle ? (
          <NodeInput
            title={data.label}
            id={data.id}
            setIsRenamingTitle={setIsRenamingTitle}
          />
        ) : (
          <h2
            onDoubleClick={() => setIsRenamingTitle(true)}
            className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent4"
          >
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} variant="accent4" />
      </div>
    </NodeWrapper>
  );
};

export default memo(IONode);
