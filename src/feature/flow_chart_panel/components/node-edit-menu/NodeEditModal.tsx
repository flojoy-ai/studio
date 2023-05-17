import { Node } from "reactflow";
import { ElementsData } from "../../types/CustomNodeProps";
import { FUNCTION_PARAMETERS } from "../../manifest/PARAMETERS_MANIFEST";
import ParamField, { ParamType } from "./ParamField";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Box, Title, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  modal: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    height: 684,
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
};

const NodeEditModal = ({ node }: NodeEditModalProps) => {
  const { classes } = useStyles();
  const { setIsEditMode } = useFlowChartState();
  const replayNotice = "Replay the script to see your changes take effect";
  const [isDataChanged, setIsDataChanged] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    if(isDataChanged === undefined){
      setIsDataChanged(false)
    }
    else{
      setIsDataChanged(true)
    }
  }, [node.data.ctrls]);

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
          {isDataChanged && (<div className={classes.replayScriptNotice}><i>{replayNotice}</i></div>)}
        </div>
      </Box>
    </Box>
  );
};

export default NodeEditModal;
