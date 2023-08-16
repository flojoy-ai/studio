import { NodeResult } from "@src/feature/common/types/ResultsType";
// import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Node } from "reactflow";
import { ElementsData } from "@/types";
import NodeModal from "./NodeModal";
import { useEffect, useState } from "react";
// import { useFlowChartTabState } from "../FlowChartTabState";

type NodeExpandMenuProps = {
  modalIsOpen: boolean;
  setModalOpen: (open: boolean) => void;
  nodeResults: NodeResult[];
  selectedNode: Node<ElementsData> | null;
  pythonString: string;
  nodeFilePath: string;
};

export const NodeExpandMenu = ({
  nodeResults,
  ...props
}: NodeExpandMenuProps) => {
  const { selectedNode } = props;
  const [nodeResult, setNodeResult] = useState<NodeResult | null>(null);
  // const onSelectionChange = () => {
  //   if (!selectedNode) {
  //     setIsExpandMode(false);
  //   }
  // };

  // useOnSelectionChange({ onChange: onSelectionChange });

  useEffect(() => {
    setNodeResult(
      nodeResults.find((node) => node.id === selectedNode?.id) ?? null,
    );
  }, [selectedNode, nodeResults]);

  return (
    <div className="relative" data-testid="node-modal">
      {selectedNode && (
        <NodeModal
          {...props}
          nd={nodeResult}
          selectedNode={selectedNode}
          data-testid="expand-menu"
        />
      )}
    </div>
  );
};
