import { Node } from "reactflow";
import { ElementsData } from "../../types/CustomNodeProps";
import ParamField from "./ParamField";
import { IconPencil, IconX, IconCheck } from "@tabler/icons-react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Box, Title, createStyles, TextInput } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import Draggable from "react-draggable";
import { ParamTooltip } from "../ParamTooltip";
import { notifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    margin: "0 0 10px 0",
  },
  paramName: {
    fontWeight: 600,
    fontSize: 14,
    marginTop: 16,
    marginBottom: 4,
  },
  closeButton: {
    width: "fit-content",
    height: 18,
    marginLeft: "auto",
    cursor: "pointer",
  },
  replayScriptNotice: {
    fontSize: 12,
    margin: 6,
  },
}));

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
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(node.data.label);
  const { classes } = useStyles();
  const { setIsEditMode, setNodeParamChanged, nodeParamChanged } =
    useFlowChartState();
  const replayNotice = "Replay the script to see your changes take effect";
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

  useEffect(() => {
    if (nodeParamChanged === undefined) {
      setNodeParamChanged(false);
    } else {
      setNodeParamChanged(true);
    }
  }, [node.data.ctrls]);

  return (
    <Draggable bounds="main" cancel="#undrag,#title_input">
      <div className="absolute right-10 top-10 z-10 rounded-xl border border-accent1 bg-modal p-2">
        <Box
          onClick={() => setIsEditMode(false)}
          className={classes.closeButton}
        >
          <IconX size={18} data-testid="node-edit-modal-close-btn" />
        </Box>
        <Box p="0px 16px 24px 16px">
          <div key={node.id}>
            <Box className={classes.titleContainer}>
              {isRenamingTitle ? (
                <>
                  <TextInput
                    id={"title_input"}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <IconCheck
                    onClick={() => {
                      handleTitleChange(newTitle);
                    }}
                    size={28}
                    style={{
                      marginLeft: "8px",
                      marginBottom: "4px",
                      cursor: "pointer",
                    }}
                  />
                </>
              ) : (
                <>
                  <Title size="h4" className={classes.title}>
                    {node.data.label}
                  </Title>
                  <IconPencil
                    onClick={() => {
                      setIsRenamingTitle(true);
                    }}
                    size={18}
                    style={{
                      marginLeft: "16px",
                      marginBottom: "4px",
                      cursor: "pointer",
                    }}
                  />
                </>
              )}
            </Box>
            {Object.keys(node.data.ctrls).length > 0 ? (
              <>
                {Object.entries(node.data.ctrls).map(([name, param]) => (
                  <div key={node.id + name} id="undrag" data-testid="node-edit-modal-params">
                    <ParamTooltip
                      param={{ name, type: param.type, desc: param.desc }}
                      offsetX={-288}
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
                  <div className={classes.replayScriptNotice}>
                    <i>{replayNotice}</i>
                  </div>
                )}
              </>
            ) : (
              <div>This node takes no parameters</div>
            )}
          </div>
        </Box>
      </div>
    </Draggable>
  );
};

export default memo(NodeEditModal);
