import { NodeResult } from "@src/feature/common/types/ResultsType";
// import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Node } from "reactflow";
import { ElementsData } from "flojoy/types";
import NodeModal from "./NodeModal";
import { useEffect, useState } from "react";
// import { useFlowChartTabState } from "../FlowChartTabState";

type NodeExpandMenuProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: string;
  nodeType: string;
  nodeResults: NodeResult[];
  selectedNode: Node<ElementsData> | null;
  pythonString: string;
  nodeFilePath: string;
};

export const NodeExpandMenu = ({
  modalIsOpen,
  closeModal,
  nodeLabel,
  nodeType,
  nodeResults,
  selectedNode,
  pythonString,
  nodeFilePath,
}: NodeExpandMenuProps) => {
  // const { isExpandMode, setIsExpandMode } = useFlowChartState();
  const [nodeResult, setNodeResult] = useState<NodeResult | null>(null);
  // const onSelectionChange = () => {
  //   if (!selectedNode) {
  //     setIsExpandMode(false);
  //   }
  // };

  // useOnSelectionChange({ onChange: onSelectionChange });

  useEffect(() => {
    setNodeResult(
      nodeResults.find((node) => node.id === selectedNode?.id) ?? null
    );
  }, [selectedNode, nodeResults]);

  return (
    <div className="relative" data-testid="node-modal">
      {selectedNode && (
        <NodeModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          nodeLabel={nodeLabel}
          nodeType={nodeType}
          nd={nodeResult}
          pythonString={pythonString}
          nodeFilePath={nodeFilePath}
          data-testid="expand-menu"
          selectedNode={selectedNode}
        />
      )}
    </div>
  );
};
