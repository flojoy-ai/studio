import { Button } from "@src/components/ui/button";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "@src/types";
import { CopyPlus, Info, Pencil, X } from "lucide-react";
import { useCallback } from "react";
import { useStore, Node, useReactFlow } from "reactflow";

export type MenuInfo = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

type ContextMenuProps = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onClick?: () => void;
  duplicateNode: (node: Node<ElementsData>) => void;
  setNodeModalOpen: (open: boolean) => void;
};

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick,
  duplicateNode,
  setNodeModalOpen,
}: ContextMenuProps) {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const { setIsEditMode } = useFlowChartState();
  const { addSelectedNodes } = useStore((state) => ({
    resetSelectedElements: state.resetSelectedElements,
    addSelectedNodes: state.addSelectedNodes,
  }));
  const editNode = () => {
    addSelectedNodes([id]);
    setIsEditMode(true);
  };

  const openInfo = () => {
    addSelectedNodes([id]);
    setIsEditMode(false);
    setNodeModalOpen(true);
  };

  const duplicate = () => {
    const node = getNode(id);
    if (!node) {
      return;
    }
    duplicateNode(node);
  };

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 rounded-md border bg-background"
      onClick={onClick}
    >
      <Button
        onClick={editNode}
        variant="ghost"
        size="sm"
        className="flex w-full justify-start gap-2"
      >
        <Pencil size={14} />
        Edit Block
      </Button>
      <Button
        onClick={duplicate}
        variant="ghost"
        size="sm"
        className="flex w-full justify-start gap-2"
      >
        <CopyPlus size={14} />
        Duplicate Block
      </Button>
      <hr />
      <Button
        onClick={openInfo}
        variant="ghost"
        size="sm"
        className="flex w-full justify-start gap-2"
      >
        <Info size={14} />
        Block Info
      </Button>
      <hr />
      <Button
        onClick={deleteNode}
        variant="ghost"
        size="sm"
        className="flex w-full justify-start gap-2"
      >
        <X size={14} />
        Delete Block
      </Button>
    </div>
  );
}
