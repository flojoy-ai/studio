import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "../../types/CustomNodeProps";
import { Node, useOnSelectionChange } from "reactflow";
import NodeEditModal from "./NodeEditModal";
import { Box } from "@mantine/core";

type NodeEditMenuProps = {
  selectedNode: Node<ElementsData> | null;
};

export const NodeEditMenu = ({ selectedNode }: NodeEditMenuProps) => {
  const { isEditMode, setIsEditMode } = useFlowChartState();

  const canEditNode = selectedNode
    ? Object.keys(selectedNode.data.ctrls).length > 0
    : false;

  const onSelectionChange = () => {
    if (!selectedNode || !canEditNode) {
      setIsEditMode(false);
    }
  };
  useOnSelectionChange({ onChange: onSelectionChange });

  return (
    <Box pos="relative">
      {selectedNode && canEditNode && isEditMode && (
        <NodeEditModal node={selectedNode} />
      )}
    </Box>
  );
};
