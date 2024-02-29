import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@/renderer/types/node";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import NodeInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import { BlockLabel } from "../common/BlockLabel";
import DebuggingBlockSvg from "@/renderer/assets/blocks/debugging-svg";

const DSPBlock = ({ selected, data }: CustomNodeProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          "relative flex min-h-[96px] items-center justify-center rounded-lg  p-0",
          { "shadow-around shadow-accent2": nodeRunning || selected },
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
          <DebuggingBlockSvg blockName={data.func} />
        )}
        <HandleComponent data={data} variant="accent2" />
      </div>
      <BlockLabel label={data.label} className="text-accent2" />
    </NodeWrapper>
  );
};

export default memo(DSPBlock);
