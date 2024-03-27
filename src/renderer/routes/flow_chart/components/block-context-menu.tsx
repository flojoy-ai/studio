import { BlockData } from "@/renderer/types/block";
import { Code, CopyPlus, Info, Pencil, X } from "lucide-react";
import { useStore, Node } from "reactflow";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import { useShallow } from "zustand/react/shallow";
import { MenuInfo } from "@/renderer/types/context-menu";
import { ContextMenuAction } from "@/renderer/components/common/context-menu-action";
import { useDeleteBlock } from "@/renderer/stores/project";

export type BlockContextMenuInfo = MenuInfo<BlockData> & {
  fullPath: string;
};

type Props = BlockContextMenuInfo & {
  fullPath: string;
  onClick?: () => void;
  duplicateBlock: (node: Node<BlockData>) => void;
  setNodeModalOpen: (open: boolean) => void;
};

export default function BlockContextMenu({
  node,
  top,
  left,
  right,
  bottom,
  fullPath,
  onClick,
  duplicateBlock,
  setNodeModalOpen,
}: Props) {
  const { withPermissionCheck } = useWithPermission();

  const setIsEditMode = useFlowchartStore(
    useShallow((state) => state.setIsEditMode),
  );

  const { addSelectedNodes } = useStore((state) => ({
    resetSelectedElements: state.resetSelectedElements,
    addSelectedNodes: state.addSelectedNodes,
  }));

  const editNode = () => {
    addSelectedNodes([node.id]);
    setIsEditMode(true);
  };

  const openInfo = () => {
    addSelectedNodes([node.id]);
    setIsEditMode(false);
    setNodeModalOpen(true);
  };

  const editPythonCode = async () => {
    await window.api.openEditorWindow(fullPath);
  };

  const duplicate = () => {
    duplicateBlock(node);
  };

  const openInVSC = async () => {
    await window.api.openLink(`vscode://file/${fullPath}`);
  };

  const deleteBlock = useDeleteBlock();

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
        onClick={() => deleteBlock(node.id)}
        icon={X}
      >
        Delete Block
      </ContextMenuAction>
    </div>
  );
}
