import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "@/types";
import { Node } from "reactflow";
import NodeEditModal from "./NodeEditModal";

type NodeEditMenuProps = {
  selectedNode: Node<ElementsData> | null;
  unSelectedNodes: Node<ElementsData>[] | null; //used in ParamField.tsx for references
  setNodeModalOpen: (open: boolean) => void;
  handleDelete: (nodeId: string, nodeLabel: string) => void;
};

export const NodeEditMenu = ({
  selectedNode,
  unSelectedNodes,
  setNodeModalOpen,
  handleDelete,
}: NodeEditMenuProps) => {
  const { isEditMode } = useFlowChartState();

  return (
    <div className="relative">
      {selectedNode && isEditMode && (
        <NodeEditModal
          node={selectedNode}
          otherNodes={unSelectedNodes}
          setNodeModalOpen={setNodeModalOpen}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};
