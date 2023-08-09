import { Node } from "reactflow";
import { ElementsData } from "flojoy/types";
import ParamField from "./ParamField";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { memo, useEffect, useState } from "react";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import Draggable from "react-draggable";
import { ParamTooltip } from "flojoy/components";
import { notifications } from "@mantine/notifications";
import { Check, Info, Pencil, TrashIcon, X } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";

type NodeEditModalProps = {
  node: Node<ElementsData>;
  otherNodes: Node<ElementsData>[] | null;
  nodes: Node<ElementsData>[];
  setNodes: (nodes: Node<ElementsData>[]) => void;
  setNodeModalOpen: (open: boolean) => void;
  handleDelete: (nodeId: string, nodeLabel: string) => void;
};

const NodeEditModal = ({
  node,
  otherNodes,
  nodes,
  setNodes,
  setNodeModalOpen,
  handleDelete,
}: NodeEditModalProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(node.data.label);
  const { nodeParamChanged } = useFlowChartState();
  //converted from node to Ids here so that it will only do this when the edit menu is opened
  const nodeReferenceOptions =
    otherNodes?.map((node) => ({ label: node.data.label, value: node.id })) ??
    [];

  const handleTitleChange = (value: string) => {
    setIsRenamingTitle(false);
    if (value === node.data.label) {
      return;
    }
    const isDuplicate = nodes.find(
      (n) => n.data.label === value && n.data.id !== node.data.id
    );
    if (isDuplicate) {
      notifications.show({
        id: "label-change-error",
        color: "red",
        title: "Cannot change label",
        message: `There is another node with the same label: ${value}`,
        autoClose: 5000,
        withCloseButton: true,
      });
      return;
    }
    const updatedNodes = nodes?.map((n) => {
      if (n.data.id === node.data.id) {
        return { ...n, data: { ...n.data, label: value } };
      }
      return n;
    });
    setNodes(updatedNodes);
  };

  useEffect(() => {
    setNewTitle(node.data.label);
  }, [node.data.id]);

  return (
    <Draggable bounds="main" cancel="#undrag,#title_input">
      <div className="absolute right-10 top-48 z-10 min-w-[320px] rounded-xl border border-gray-800 bg-modal p-4 ">
        <div className="flex items-center">
          <div>
            {isRenamingTitle ? (
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
                    handleTitleChange(newTitle);
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
                    setIsRenamingTitle(true);
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

          {!isRenamingTitle && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(node.id, node.data.label)}
            >
              <TrashIcon size={20} className="stroke-muted-foreground" />
            </Button>
          )}
        </div>

        <div>
          {Object.keys(node.data.ctrls).length > 0 ? (
            <>
              {Object.entries(node.data.ctrls).map(([name, param]) => (
                <div
                  key={node.id + name}
                  id="undrag"
                  data-testid="node-edit-modal-params"
                >
                  <ParamTooltip
                    param={{ name, type: param.type, desc: param.desc }}
                    offsetX={30}
                    offsetY={0}
                  >
                    <p className="mb-1 mt-4 cursor-pointer text-sm font-semibold">{`${name.toUpperCase()}:`}</p>
                  </ParamTooltip>
                  <ParamField
                    nodeId={node.id}
                    nodeCtrls={node.data.ctrls[name]}
                    type={param.type as ParamValueType}
                    value={node.data.ctrls[name].value}
                    options={param.options}
                    nodeReferenceOptions={nodeReferenceOptions}
                  />
                </div>
              ))}
              {nodeParamChanged && (
                <div className="mt-2 text-sm">
                  Replay the flow for the changes to take effect
                </div>
              )}
            </>
          ) : (
            <div className="mt-2 text-sm">This node takes no parameters</div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default memo(NodeEditModal);
