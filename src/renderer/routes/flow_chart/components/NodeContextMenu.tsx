import { Button } from "@/renderer/components/ui/button";
import { ElementsData } from "@/renderer/types";
import { Code, CopyPlus, Info, LucideIcon, Pencil, X } from "lucide-react";
import { useCallback } from "react";
import { useStore, Node, useReactFlow } from "reactflow";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useFlowchartStore } from "@/renderer/stores/flowchart";

export type MenuInfo = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  fullPath: string;
};

type ContextMenuActionProps = {
  onClick: () => void;
  children: React.ReactNode;
  icon: LucideIcon;
  testId: string;
};

const ContextMenuAction = ({
  onClick,
  children,
  icon,
  testId,
}: ContextMenuActionProps) => {
  const Icon = icon;
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      data-testid={testId}
      size="sm"
      className="flex w-full justify-start gap-2"
    >
      <Icon size={14} />
      {children}
    </Button>
  );
};

type ContextMenuProps = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  fullPath: string;
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
  fullPath,
  onClick,
  duplicateNode,
  setNodeModalOpen,
}: ContextMenuProps) {
  const { withPermissionCheck } = useWithPermission();
  const { getNode, setNodes, setEdges } = useReactFlow();

  const setIsEditMode = useFlowchartStore((state) => state.setIsEditMode);

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

  const editPythonCode = async () => {
    await window.api.openEditorWindow(fullPath);
  };

  const duplicate = () => {
    const node = getNode(id);
    if (!node) {
      return;
    }
    duplicateNode(node);
  };

  const openInVSC = async () => {
    await window.api.openLink(`vscode://file/${fullPath}`);
  };

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [setNodes, setEdges, id]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 rounded-md border bg-background"
      onClick={onClick}
      data-testid={"block-context-menu"}
    >
      <ContextMenuAction
        testId="context-edit-block"
        onClick={editNode}
        icon={Pencil}
      >
        Edit Block
      </ContextMenuAction>
      <ContextMenuAction
        testId="context-edit-python"
        onClick={withPermissionCheck(editPythonCode)}
        icon={Code}
      >
        Edit Python Code
      </ContextMenuAction>
      <ContextMenuAction
        testId="open-in-vscode"
        onClick={withPermissionCheck(openInVSC)}
        icon={Code}
      >
        Open in VSCode
      </ContextMenuAction>
      <ContextMenuAction
        testId="context-duplicate-block"
        onClick={duplicate}
        icon={CopyPlus}
      >
        Duplicate Block
      </ContextMenuAction>
      <hr />
      <ContextMenuAction
        testId="context-block-info"
        onClick={openInfo}
        icon={Info}
      >
        Block Info
      </ContextMenuAction>
      <hr />
      <ContextMenuAction
        testId="context-delete-block"
        onClick={deleteNode}
        icon={X}
      >
        Delete Block
      </ContextMenuAction>
    </div>
  );
}
