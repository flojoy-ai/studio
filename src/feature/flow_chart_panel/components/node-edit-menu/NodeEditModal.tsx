import { Node } from "reactflow";
import { ElementsData } from "flojoy/types";
import ParamField from "./ParamField";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { memo, useEffect, useState } from "react";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import Draggable from "react-draggable";
import { ParamTooltip } from "flojoy/components";
import { notifications } from "@mantine/notifications";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamList } from "./ParamList";

type NodeEditModalProps = {
  node: Node<ElementsData>;
  otherNodes: Node<ElementsData>[] | null;
  nodes: Node<ElementsData>[];
  setNodes: (nodes: Node<ElementsData>[]) => void;
};

const NodeEditModal = ({
  node,
  otherNodes,
  nodes,
  setNodes,
}: NodeEditModalProps) => {
  const { updateInitCtrlInputDataForNode, updateCtrlInputDataForNode } =
    useFlowChartGraph();
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(node.data.label);
  const { setIsEditMode, nodeParamChanged } = useFlowChartState();
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
      <div className="absolute right-10 top-48 z-10 min-w-[320px] rounded-xl border border-accent1 bg-modal p-4 ">
        <div className="flex items-center">
          <div>
            {isRenamingTitle ? (
              <div className="flex">
                <Input
                  id={"title_input"}
                  className="w-max"
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
                  <Check size="20" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-lg font-bold">{node.data.label}</div>
                <div className="px-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsRenamingTitle(true);
                  }}
                >
                  <Pencil size="20" />
                </Button>
              </div>
            )}
          </div>
          <div className="grow" />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsEditMode(false);
            }}
          >
            <X size="20" data-testid="node-edit-modal-close-btn" />
          </Button>
        </div>

        <div className="">
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
              <div className="mt-2 text-sm">This node takes no parameters</div>
            )}
            {nodeParamChanged && (
              <div className="mt-2 text-sm">
                Replay the flow for the changes to take effect
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default memo(NodeEditModal);
