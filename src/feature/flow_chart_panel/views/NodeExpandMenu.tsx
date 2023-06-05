import { Box } from "@mantine/core";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Node, useOnSelectionChange } from "reactflow";
import { ElementsData } from "../types/CustomNodeProps";
import NodeModal from "./NodeModal";

type NodeExpandMenuProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: string;
  nodeType: string;
  nd: ResultIO | null;
  selectedNode: Node<ElementsData> | null;
  pythonString: string;
  nodeFilePath: string;
};

export const NodeExpandMenu = ({
  closeModal,
  nodeLabel,
  nodeType,
  nd,
  selectedNode,
  pythonString,
  nodeFilePath,
}: NodeExpandMenuProps) => {
  const { isExpandMode, setIsExpandMode } = useFlowChartState();
  const onSelectionChange = () => {
    if (!selectedNode) {
      setIsExpandMode(false);
    }
  };

  useOnSelectionChange({ onChange: onSelectionChange });

  return (
    <Box pos="relative" data-testid="node-modal">
      {selectedNode && isExpandMode && (
        <NodeModal
          modalIsOpen={isExpandMode}
          closeModal={closeModal}
          nodeLabel={nodeLabel}
          nodeType={nodeType}
          nd={nd}
          pythonString={pythonString}
          nodeFilePath={nodeFilePath}
          data-testid="expand-menu"
          selectedNode={selectedNode}
        />
      )}
    </Box>
  );
};
