import { useSocket } from "@src/hooks/useSocket";
import { nodeTypesMap } from "flojoy/components";
import { useMemo } from "react";
import { NodeTypes } from "reactflow";

type UseNodeTypesProps = {
  handleRemove: (nodeId: string, nodeLabel: string) => void;
  handleClickExpand: () => void;
  wrapperOnClick: () => void;
  theme: "light" | "dark";
};

const useNodeTypes = ({
  handleRemove,
  handleClickExpand,
  wrapperOnClick,
  theme,
}: UseNodeTypesProps) => {
  const {
    states: { programResults, failedNode, runningNode, failureReason },
  } = useSocket();
  const nodeTypes: NodeTypes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(nodeTypesMap).map(([key, CustomNode]) => {
          return [
            key,
            (props) => (
              <CustomNode
                isRunning={runningNode === props.data.id}
                nodeError={failedNode === props.id ? failureReason : undefined}
                plotlyFig={
                  programResults?.io?.find((r) => r.id === props.data.id)
                    ?.result.default_fig ?? undefined
                }
                nodeProps={props}
                handleRemove={handleRemove}
                handleClickExpand={handleClickExpand}
                wrapperOnClick={wrapperOnClick}
                theme={theme}
              />
            ),
          ];
        })
      ),
    [programResults, failedNode, runningNode, failureReason, theme]
  );

  return nodeTypes;
};

export default useNodeTypes;
