import { Node } from "reactflow";
import { BlockData } from "@/renderer/types/block";
import { memo, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ParamList } from "./ParamList";
import { Check, Info, Pencil, TrashIcon, X } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { LAYOUT_TOP_HEIGHT } from "@/renderer/routes/common/Layout";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import { useDeleteBlock, useProjectStore } from "@/renderer/stores/project";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

type Props = {
  node: Node<BlockData>;
  otherNodes: Node<BlockData>[] | null;
  setNodeModalOpen: (open: boolean) => void;
};

const BlockEditModal = ({ node, otherNodes, setNodeModalOpen }: Props) => {
  const { updateBlockParameter, updateBlockInitParameter, updateBlockLabel } =
    useProjectStore(
      useShallow((state) => ({
        updateBlockParameter: state.updateBlockParameter,
        updateBlockInitParameter: state.updateBlockInitParameter,
        updateBlockLabel: state.updateBlockLabel,
      })),
    );

  const { withPermissionCheck } = useWithPermission();
  const [newTitle, setNewTitle] = useState(node.data.label);
  const [editRenamingTitle, setEditRenamingTitle] = useState(false);

  const { setIsEditMode, nodeParamChanged } = useFlowchartStore(
    useShallow((state) => ({
      setIsEditMode: state.setIsEditMode,
      nodeParamChanged: state.nodeParamChanged,
    })),
  );
  const deleteBlock = useDeleteBlock();

  //converted from node to Ids here so that it will only do this when the edit menu is opened
  const nodeReferenceOptions =
    otherNodes?.map((node) => ({ label: node.data.label, value: node.id })) ??
    [];

  const confirmLabelChange = () => {
    setEditRenamingTitle(false);
    const res = updateBlockLabel(node.data.id, newTitle);
    if (res.isErr()) {
      toast.error(res.error.message);
    }
  };

  useEffect(() => {
    setNewTitle(node.data.label);
  }, [node.data.id, node.data.label]);

  return (
    <Draggable bounds="parent" cancel="#undrag,#title_input">
      <div
        className="absolute right-10 top-8 z-10 min-w-[320px] max-w-sm rounded-xl border border-gray-300 bg-modal py-4 dark:border-gray-800"
        style={{
          maxHeight: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px - 96px)`,
        }}
      >
        <div className="flex items-center pb-2 pl-4">
          <div>
            {editRenamingTitle ? (
              <div className="flex">
                <Input
                  id="title_input"
                  data-testid="block-label-input"
                  className="w-max bg-modal"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <div className="px-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  data-testid="block-label-submit"
                  onClick={confirmLabelChange}
                >
                  <Check size={20} className="stroke-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="max-w-[224px] overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-semibold">
                  {node.data.label}
                </div>
                <div className="px-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  data-testid="block-label-edit"
                  onClick={withPermissionCheck(() =>
                    setEditRenamingTitle(true),
                  )}
                >
                  <Pencil size={20} className="stroke-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setNodeModalOpen(true);
                  }}
                  data-testid="block-info-btn"
                >
                  <Info size={20} className="stroke-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
          <div className="grow" />

          {!editRenamingTitle && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditMode(false)}
              data-testid="block-edit-close-button"
              className="mr-4 p-2"
            >
              <X size={20} className="stroke-muted-foreground" />
            </Button>
          )}
        </div>

        <ScrollArea>
          <div
            className="pl-4 pr-8"
            style={{
              maxHeight: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px - 96px - 144px)`,
            }}
          >
            <div key={node.id}>
              {node.data.initCtrls &&
                Object.keys(node.data.initCtrls).length > 0 && (
                  <ParamList
                    nodeId={node.id}
                    ctrls={node.data.initCtrls}
                    updateFunc={updateBlockInitParameter}
                  />
                )}
              {Object.keys(node.data.ctrls).length > 0 ? (
                <ParamList
                  nodeId={node.id}
                  ctrls={node.data.ctrls}
                  updateFunc={updateBlockParameter}
                  nodeReferenceOptions={nodeReferenceOptions}
                />
              ) : (
                <div className="mt-2 text-sm">
                  This node takes no parameters
                </div>
              )}
              {nodeParamChanged && (
                <div className="mt-4 text-sm font-medium italic text-muted-foreground">
                  Replay the flow for the changes to take effect
                </div>
              )}
            </div>
            <div className="py-2" />
          </div>
        </ScrollArea>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteBlock(node.id)}
            className="mr-4"
            data-testid="delete-node-button"
          >
            <TrashIcon size={20} className="stroke-muted-foreground" />
          </Button>
        </div>
      </div>
    </Draggable>
  );
};

export default memo(BlockEditModal);
