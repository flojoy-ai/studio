import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@/renderer/types/node";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import NodeInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import AIBlockSvg from "@/renderer/assets/blocks/AI-block-svg";
import { BlockLabel } from "../common/NodeLabel";

const AIBlock = ({ selected, data }: CustomNodeProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          "border-accent-boolean relative flex min-h-[96px] items-center justify-center rounded-lg border-2 border-solid p-2",
          { "shadow-accent-boolean shadow-around": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
        onDoubleClick={() => setIsRenamingTitle(true)}
      >
        {isRenamingTitle ? (
          <NodeInput
            title={data.label}
            id={data.id}
            setIsRenamingTitle={setIsRenamingTitle}
          />
        ) : (
          <AIBlockSvg blockName={data.func} />
        )}
        <HandleComponent data={data} variant="accent-boolean" />
      </div>
      <BlockLabel label={data.label} className="text-accent-boolean" />
    </NodeWrapper>
  );
};

export default memo(AIBlock);
