import { useMantineTheme } from "@mantine/styles";
import { Node } from "reactflow";
import { ElementsData } from "../../types/CustomNodeProps";
import { FUNCTION_PARAMETERS } from "../../manifest/PARAMETERS_MANIFEST";
import ParamField, { ParamType } from "./ParamField";
import styled from "styled-components";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Box, Title, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  modal: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    height: 684,
    width: 324,
    padding: "8px 8px",
    // backgroundColor: theme.colorScheme === "dark" ? "#1" : "white",
    backgroundColor: theme.colors.modal[0],
    boxShadow:
      theme.colorScheme === "dark"
        ? "none"
        : "0px 0px 16px 0px rgba(0,0,0,0.3)",
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
}));

type NodeEditModalProps = {
  node: Node<ElementsData>;
};

const NodeEditModal = ({ node }: NodeEditModalProps) => {
  const { classes } = useStyles();
  const { setIsEditMode } = useFlowChartState();

  return (
    <Box className={classes.modal}>
      <Box onClick={() => setIsEditMode(false)} className={classes.closeButton}>
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
              style={{ marginLeft: "1rem", marginBottom: "4px" }}
            />
          </Box>
          {Object.entries(FUNCTION_PARAMETERS[node.data.func]).map(
            ([name, param]) => (
              <div key={node.id + name}>
                <p className={classes.paramName}>{`${name.toUpperCase()}:`}</p>
                <ParamField
                  nodeId={node.id}
                  paramId={name}
                  functionName={node.data.func}
                  type={param.type as ParamType}
                  value={node.data.ctrls[name].value}
                  options={param.options}
                />
              </div>
            )
          )}
        </div>
      </Box>
    </Box>
  );
};

export default NodeEditModal;
