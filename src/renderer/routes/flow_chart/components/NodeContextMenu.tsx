import { useFlowChartState } from '@src/hooks/useFlowChartState';
import { ElementsData } from '@src/types';
import { CopyPlus, Pencil, X } from 'lucide-react';
import { useCallback } from 'react';
import { useStore, Node, useReactFlow } from 'reactflow';

export type MenuInfo = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

type ContextMenuProps = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onClick?: () => void;
  duplicateNode: (node: Node<ElementsData>) => void;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick,
  duplicateNode
}: ContextMenuProps) {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const { setIsEditMode } = useFlowChartState();
  const { resetSelectedElements, addSelectedNodes } = useStore(state => ({ resetSelectedElements: state.resetSelectedElements, addSelectedNodes: state.addSelectedNodes }));
  const editNode = () => {
    resetSelectedElements();
    addSelectedNodes([id])
    setIsEditMode(true);
  }

  const duplicate = () => {
    const node = getNode(id);
    if (!node) {
      return;
    }
    duplicateNode(node);
  }

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 bg-background border rounded-md"
      onClick={onClick}
    >
      <button onClick={editNode} className="hover:bg-muted/50 px-2 py-1 text-sm flex items-center gap-2 w-full"><Pencil size={14} />Edit Node</button>
      <button onClick={duplicate} className="hover:bg-muted/50 px-2 py-1 text-sm flex items-center gap-2 w-full"><CopyPlus size={14} />Duplicate Node</button>
      <button onClick={deleteNode} className="hover:bg-muted/50 px-2 py-1 text-sm flex items-center gap-2 w-full"><X size={14} />Delete Node</button>
    </div>
  );
}

