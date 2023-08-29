import { useSocket } from "@src/hooks/useSocket";
import { nodeTypesMap } from "@/components/nodes/nodeTypesMap";
import { useMemo } from "react";
import { NodeTypes } from "reactflow";
import { MouseEvent } from "react";
import TextNode from "@src/components/nodes/TextNode";

type UseNodeTypesProps = {
  handleRemove: (nodeId: string, nodeLabel: string) => void;
  wrapperOnClick: (event: MouseEvent<HTMLDivElement>) => void;
};

const useNodeTypes = ({ handleRemove }: UseNodeTypesProps) => {
  const {
    states: { programResults, failedNodes, runningNode },
  } = useSocket();

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      ...Object.fromEntries(
        Object.entries(nodeTypesMap).map(([key, CustomNode]) => {
          return [
            key,
            (props) => {
              const nodeResult = programResults?.find(
                (node) => node.id === props.data.id,
              );
              return (
                <CustomNode
                  isRunning={runningNode === props.data.id}
                  nodeError={failedNodes[props.id]}
                  plotlyFig={nodeResult?.result?.plotly_fig ?? undefined}
                  textBlob={nodeResult?.result?.text_blob ?? undefined}
                  nodeProps={props}
                  handleRemove={handleRemove}
                />
              );
            },
          ];
        }),
      ),
      TextNode: TextNode,
    }),
    // Including incoming props like handleRemove and handleClickExpand in dependency list would cause
    // infinite re-render, so exception for eslint eslint-disable-next-line react-hooks/exhaustive-deps is added
    // to suppress eslint warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [programResults, failedNodes, runningNode],
  );

  return nodeTypes;
};

export default useNodeTypes;
