import { Box, clsx, createStyles } from "@mantine/core";
import { useEffect } from "react";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import HandleComponent from "../components/HandleComponent";
import { CustomNodeProps } from "../types/CustomNodeProps";
import NodeEditButtons from "./node-edit-menu/NodeEditButtons";
import NodeWrapper from "./NodeWrapper";

export const useNodeStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "light"
      ? theme.colors.accent2[0]
      : theme.colors.accent1[0];
  return {
    nodeContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      fontSize: 17,
      minHeight: 115,
      height: "fit-content",
    },

    defaultNode: {
      flexDirection: "column",
      justifyContent: "center",
      padding: 10,
      width: 190,
      borderRadius: 6,
      fontWeight: 600,
      border: `1px solid ${accent}`,
      color: accent,
      backgroundColor: accent + "4f",
    },

    defaultShadow: {
      boxShadow: `${
        theme.colorScheme === "dark"
          ? theme.colors.accent1[1]
          : theme.colors.accent2[0]
      } 0px 0px 27px 3px`,
    },

    simulationShadow: {
      boxShadow: `${
        theme.colorScheme === "dark"
          ? theme.colors.accent2[1]
          : theme.colors.accent1[1]
      } 0px 0px 27px 3px`,
    },

    arithmeticShadow: {
      filter: `drop-shadow(0px 0px 20px ${theme.colors.accent3[0]})`,
    },

    failShadow: {
      boxShadow: "rgb(183 0 0) 0px 0px 27px 3px",
    },
  };
});

const DefaultNode = ({ data }: CustomNodeProps) => {
  const { classes } = useNodeStyles();
  const { runningNode, failedNode, setNodes, nodes } = useFlowChartState();
  const params = data.inputs || [];

  // useEffect(() => {
  //   console.log("14");
  //   setNodes((prev) => {
  //     const selectedNode = prev.find((n) => n.id === data.id);
  //     if (selectedNode) {
  //       selectedNode.data.selected = selectedNode.selected;
  //     }
  //   });
  // }, [data, nodes, setNodes]);

  return (
    <NodeWrapper data={data}>
      <Box
        className={clsx(
          runningNode === data.id || data.selected ? classes.defaultShadow : "",
          failedNode === data.id ? classes.failShadow : ""
        )}
      >
        <Box
          className={clsx(classes.nodeContainer, classes.defaultNode)}
          style={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          {data.selected && Object.keys(data.ctrls).length > 0 && (
            <NodeEditButtons />
          )}
          <Box>{data.label}</Box>
          <Box
            display="flex"
            h={params.length > 0 ? (params.length + 1) * 40 : "fit-content"}
            sx={{
              flexDirection: "column",
            }}
          >
            <HandleComponent data={data} inputs={params} />
          </Box>
        </Box>
      </Box>
    </NodeWrapper>
  );
};

export default DefaultNode;
