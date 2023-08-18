import { Node } from "reactflow";
import { ElementsData } from "@/types";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { memo, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamList } from "./ParamList";
import { Check, Info, Pencil, TrashIcon, X } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { LAYOUT_TOP_HEIGHT } from "@src/feature/common/Layout";
import { ScrollArea } from "@src/components/ui/scroll-area";

type NodeEditModalProps = {
  node: Node<ElementsData>;
  otherNodes: Node<ElementsData>[] | null;
  setNodeModalOpen: (open: boolean) => void;
  handleDelete: (nodeId: string, nodeLabel: string) => void;
};

const NodeEditModal = ({
  node,
  otherNodes,
  setNodeModalOpen,
  handleDelete,
}: NodeEditModalProps) => {
  const { updateInitCtrlInputDataForNode, updateCtrlInputDataForNode } =
    useFlowChartGraph();
  const [newTitle, setNewTitle] = useState(node.data.label);
  const [editRenamingTitle, setEditRenamingTitle] = useState(false);
  const { nodeParamChanged, setIsEditMode } = useFlowChartState();
  const { handleTitleChange } = useFlowChartGraph();
  //converted from node to Ids here so that it will only do this when the edit menu is opened
  const nodeReferenceOptions =
    otherNodes?.map((node) => ({ label: node.data.label, value: node.id })) ??
    [];

  useEffect(() => {
    setNewTitle(node.data.label);
  }, [node.data.id]);

  return (
    <Draggable bounds="parent" cancel="#undrag,#title_input">
      <div
        className="absolute right-10 top-8 z-10 w-80 rounded-xl border border-gray-300 bg-modal py-4 dark:border-gray-800"
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
                  className="w-max bg-modal"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <div className="px-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditRenamingTitle(false);
                    handleTitleChange(newTitle, node.data.id);
                  }}
                >
                  <Check size={20} className="stroke-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-lg font-semibold">{node.data.label}</div>
                <div className="px-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditRenamingTitle(true);
                  }}
                >
                  <Pencil size={20} className="stroke-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setNodeModalOpen(true);
                  }}
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
              className="mr-4"
            >
              <X size={20} className="stroke-muted-foreground" />
            </Button>
          )}
        </div>

        <ScrollArea>
          <div className="max-h-96 pl-4 pr-8">
            <div key={node.id}>
              {node.data.initCtrls &&
                Object.keys(node.data.initCtrls).length > 0 && (
                  <ParamList
                    nodeId={node.id}
                    ctrls={node.data.initCtrls}
                    updateFunc={updateInitCtrlInputDataForNode}
                  />
                )}
              {Object.keys(node.data.ctrls).length > 0 ? (
                <ParamList
                  nodeId={node.id}
                  ctrls={node.data.ctrls}
                  updateFunc={updateCtrlInputDataForNode}
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
            onClick={() => handleDelete(node.id, node.data.label)}
            className="mr-4"
          >
            <TrashIcon size={20} className="stroke-muted-foreground" />
          </Button>
        </div>
      </div>
    </Draggable>
  );
};

export default memo(NodeEditModal);
