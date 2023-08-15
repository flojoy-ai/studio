import { useSocket } from "@src/hooks/useSocket";
import { nodeTypesMap } from "@/components/nodes/nodeTypesMap";
import React, { useMemo } from "react";
import { NodeTypes } from "reactflow";
import { MouseEvent } from "react";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";

type UseNodeTypesProps = {
  handleRemove: (nodeId: string, nodeLabel: string) => void;
  wrapperOnClick: (event: MouseEvent<HTMLDivElement>) => void;
  theme: "light" | "dark";
};

const useNodeTypes = ({ handleRemove, theme }: UseNodeTypesProps) => {
  const {
    states: { programResults, failedNode, runningNode, failureReason },
  } = useSocket();
  const { nodes } = useFlowChartGraph();

  const nodeTypes: NodeTypes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(nodeTypesMap).map(([key, CustomNode]) => {
          return [
            key,
            (props) => {
              const nodeResult = programResults?.find(
                (node) => node.id === props.data.id,
              );
              const node = nodes.find((node) => node.id === props.data.id);
              return (
                <CustomNode
                  isRunning={runningNode === props.data.id}
                  nodeError={
                    failedNode === props.id ? failureReason : undefined
                  }
                  plotlyFig={nodeResult?.result.plotly_fig ?? undefined}
                  textBlob={nodeResult?.result.text_blob ?? undefined}
                  nodeProps={props}
                  handleRemove={handleRemove}
                  theme={theme}
                  node={node}
                />
              );
            },
          ];
        }),
      ),
    // Including incoming props like handleRemove and handleClickExpand in dependency list would cause
    // infinite re-render, so exception for eslint eslint-disable-next-line react-hooks/exhaustive-deps is added
    // to suppress eslint warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [programResults, failedNode, runningNode, failureReason, theme],
  );

  return nodeTypes;
};

export default useNodeTypes;
