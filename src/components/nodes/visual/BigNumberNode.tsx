import BigNumber from "@src/assets/nodes/BigNumber";
import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo } from "react";

const BigNumberNode = ({ data, selected }: CustomNodeProps) => {
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);
  return (
    <NodeWrapper>
      <div
        className={clsx(
          "rounded-2xl bg-transparent",
          { "shadow-around shadow-accent2": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        {nodeResult?.result?.data ? (
          <h1 className="flex h-56 w-56 items-center justify-center text-6xl text-accent1">
            {nodeResult.result.data.c}
          </h1>
        ) : (
          <BigNumber />
        )}
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(BigNumberNode);
