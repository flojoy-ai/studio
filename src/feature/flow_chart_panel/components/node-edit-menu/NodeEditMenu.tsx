import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "flojoy/types";
import { Node } from "reactflow";
import NodeEditModal from "./NodeEditModal";

type NodeEditMenuProps = {
  selectedNode: Node<ElementsData> | null;
  unSelectedNodes: Node<ElementsData>[] | null; //used in ParamField.tsx for references
  nodes: Node<ElementsData>[];
  setNodes: (nodes: Node<ElementsData>[]) => void;
  setNodeModalOpen: (open: boolean) => void;
  handleDelete: (nodeId: string, nodeLabel: string) => void;
};

export const NodeEditMenu = ({
  selectedNode,
  unSelectedNodes,
  nodes,
  setNodes,
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
          nodes={nodes}
          setNodes={setNodes}
          setNodeModalOpen={setNodeModalOpen}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};
