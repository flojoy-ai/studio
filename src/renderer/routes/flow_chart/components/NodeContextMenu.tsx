import { Button } from "@src/components/ui/button";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "@src/types";
import { CopyPlus, Info, LucideIcon, Pencil, X } from "lucide-react";
import { useCallback } from "react";
import { useStore, Node, useReactFlow } from "reactflow";

export type MenuInfo = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

type ContextMenuActionProps = {
  onClick: () => void;
  children: React.ReactNode;
  icon: LucideIcon;
}

const ContextMenuAction = ({ onClick, children, icon }: ContextMenuActionProps) => {
  const Icon = icon;
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className="flex w-full justify-start gap-2"
    >
      <Icon size={14} />
      {children}
    </Button>

  )
}

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
      <ContextMenuAction onClick={editNode} icon={Pencil}>
        Edit Block
      </ContextMenuAction>
      <ContextMenuAction onClick={duplicate} icon={CopyPlus}>
        Duplicate Block
      </ContextMenuAction>
      <hr />
      <ContextMenuAction onClick={openInfo} icon={Info}>
        Block Info
      </ContextMenuAction>
      <hr />
      <ContextMenuAction onClick={deleteNode} icon={X}>
        Delete Block
      </ContextMenuAction>
    </div >
  );
}
