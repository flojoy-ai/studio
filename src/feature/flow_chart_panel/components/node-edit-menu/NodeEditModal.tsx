import { Node } from "reactflow";
import { ElementsData } from "../../types/CustomNodeProps";
import { FUNCTION_PARAMETERS } from "../../manifest/PARAMETERS_MANIFEST";
import ParamField from "./ParamField";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Box, Title, createStyles } from "@mantine/core";
import { memo, useEffect } from "react";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import Draggable from "react-draggable";

const useStyles = createStyles((theme) => ({
  modal: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    height: "calc(100vh - 300px)",
    width: 324,
    padding: "8px 8px",
    backgroundColor: theme.colors.modal[0],
    boxShadow:
      theme.colorScheme === "dark" ? "none" : "0px 0px 8px 0px rgba(0,0,0,0.3)",
  },
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
};

const NodeEditModal = ({ node, otherNodes }: NodeEditModalProps) => {
  const { classes } = useStyles();
  const { setIsEditMode, setNodeParamChanged, nodeParamChanged } =
    useFlowChartState();
  const replayNotice = "Replay the script to see your changes take effect";
  //converted from node to Ids here so that it will only do this when the edit menu is opened
  const nodeReferenceOptions =
    otherNodes?.map((node) => ({ label: node.data.label, value: node.id })) ||
    [];

  useEffect(() => {
    if (nodeParamChanged === undefined) {
      setNodeParamChanged(false);
    } else {
      setNodeParamChanged(true);
    }
  }, [node.data.ctrls]);

  return (
    <Draggable bounds="main" cancel="#undrag">
      <Box className={classes.modal}>
        <Box
          onClick={() => setIsEditMode(false)}
          className={classes.closeButton}
        >
          <IconX size={18} />
        </Box>
        <Box p="0px 16px 24px 16px">
          <div key={node.id}>
            <Box className={classes.titleContainer}>
              <Title size="h4" className={classes.title}>
                {node.data.func.toUpperCase()}
              </Title>
              <IconPencil
                size={18}
                style={{ marginLeft: "16px", marginBottom: "4px" }}
              />
            </Box>
            {Object.entries(FUNCTION_PARAMETERS[node.data.func]).map(
              ([name, param]) => (
                <div key={node.id + name} id="undrag">
                  <p
                    className={classes.paramName}
                  >{`${name.toUpperCase()}:`}</p>
                  <ParamField
                    nodeId={node.id}
                    paramId={name}
                    functionName={node.data.func}
                    type={param.type as ParamValueType}
                    value={node.data.ctrls[name].value}
                    options={param.options}
                    nodeReferenceOptions={nodeReferenceOptions}
                  />
                </div>
              )
            )}
            {nodeParamChanged && (
              <div className={classes.replayScriptNotice}>
                <i>{replayNotice}</i>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </Draggable>
  );
};

export default memo(NodeEditModal);
