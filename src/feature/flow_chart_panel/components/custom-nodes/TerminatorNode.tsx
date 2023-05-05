import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@src/feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import { useEffect } from "react";
import NodeWrapper from "@src/feature/flow_chart_panel/components/node-wrapper/NodeWrapper";
import { useMantineColorScheme } from "@mantine/core";

const TerminatorNode = ({ data }: CustomNodeProps) => {
  const { colorScheme } = useMantineColorScheme();
  const { runningNode, failedNode, setNodes, nodes } = useFlowChartState();
  const params = data.inputs || [];

  useEffect(() => {
    setNodes((prev) => {
      const selectedNode = prev.find((n) => n.id === data.id);
      if (selectedNode) {
        selectedNode.data.selected = selectedNode.selected;
      }
    });
  }, [data, nodes, setNodes]);

  return (
    <NodeWrapper data={data}>
      <div
        style={{
          ...((runningNode === data.id || data.selected) && {
            boxShadow: "rgb(133 197 231) 0px 0px 27px 3px",
          }),
          ...(failedNode === data.id && {
            boxShadow: "rgb(183 0 0) 0px 0px 27px 3px",
          }),
        }}
      >
        <div
          className="default_node_container"
          style={{
            backgroundColor:
              colorScheme === "light"
                ? "rgb(170 30 30 / 15%)"
                : "rgb(170 30 30 / 45%)",
            border:
              colorScheme === "light"
                ? "1px solid rgba(123, 97, 255, 1)"
                : "1px solid #99F5FF",
            color:
              colorScheme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
              width: "100%",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div>{data.label}</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height:
                params.length > 0 ? (params.length + 1) * 40 : "fit-content",
            }}
          >
            <HandleComponent data={data} inputs={params} />
          </div>
        </div>
      </div>
    </NodeWrapper>
  );
};

export default TerminatorNode;
