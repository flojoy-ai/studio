import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "../../types/CustomNodeProps";
import { Node, useOnSelectionChange } from "reactflow";
import NodeEditModal from "./NodeEditModal";

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
    <div style={{ position: "relative" }}>
      {selectedNode && canEditNode && isEditMode && (
        <NodeEditModal node={selectedNode} />
      )}
    </div>
  );
};
