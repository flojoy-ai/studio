import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import HandleComponent from "@/components/common/HandleComponent";
import { textWrap } from "@src/utils/TextWrap";
import NodeInput from "@/components/common/NodeInput";
import { useNodeStatus } from "@src/hooks/useNodeStatus";

const DataNode = ({ selected, data }: CustomNodeProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          "flex min-h-[96px] items-center justify-center rounded-full border-2 border-solid border-accent2 p-2",
          { "shadow-around shadow-accent2": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
        style={{
          width: textWrap(208, 24, data.label),
        }}
        onDoubleClick={() => setIsRenamingTitle(true)}
      >
        {isRenamingTitle ? (
          <NodeInput
            title={data.label}
            id={data.id}
            setIsRenamingTitle={setIsRenamingTitle}
          />
        ) : (
          <h2 className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent2">
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DataNode);
