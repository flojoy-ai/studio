import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import { useSocket } from "@src/hooks/useSocket";
import { useEffect, useState } from "react";

const ConditionalNode = ({ data }: CustomNodeProps) => {
  const [additionalInfo, setAdditionalInfo] = useState({});

  const { uiTheme, runningNode, failedNode, nodes, setNodes } =
    useFlowChartState();
  const params = data.inputs || [];

  useEffect(() => {
    setNodes((prev) => {
      const selectedNode = prev.find((n) => n.id === data.id);
      if (selectedNode) {
        selectedNode.data.selected = selectedNode.selected;
      }
    });
  }, [data, nodes, setNodes]);
  const { states } = useSocket();
  const { programResults } = states!;

  const isLoopInfoExist = () => {
    const isExist = Object.keys(additionalInfo).find(
      (value, _) => value === data.id
    );
    return isExist && data.func === "LOOP";
  };

  const current_iteration = isLoopInfoExist()
    ? additionalInfo[data.id]["current_iteration"] || 0
    : 0;
  const total_iteration = isLoopInfoExist()
    ? data["ctrls"][`LOOP_${data.label}_iteration_count`]["value"] || 0
    : 0;

  useEffect(() => {
    if (programResults?.io?.length! > 0) {
      let programAdditionalInfo = {};

      const results = programResults?.io;
      results?.forEach((element) => {
        programAdditionalInfo = {
          ...programAdditionalInfo,
          [element.id]: element["additional_info"],
        };
      });

      setAdditionalInfo(programAdditionalInfo);
    }
  }, [programResults]);

  return (
    <div
      style={{
        ...((runningNode === data.id || data.selected) && {
          boxShadow: "#48abe0 0px 0px 27px 3px",
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
            uiTheme === "light" ? "rgb(123 97 255 / 16%)" : "#99f5ff4f",
          border:
            uiTheme === "light"
              ? "1px solid rgba(123, 97, 255, 1)"
              : "1px solid #99F5FF",
          color: uiTheme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
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
          <div>
            {data.func === "CONDITIONAL" && (
              <>
                {params?.length !== 0 ? (
                  <p>x {data["ctrls"]["operator_type"]["value"]} y</p>
                ) : (
                  <>
                    {Object.keys(additionalInfo)
                      .filter((value, _) => value === data.id)
                      .map((_, index) => {
                        return (
                          <p key={index + 1}>
                            status: {additionalInfo[data.id]["status"]}
                          </p>
                        );
                      })}
                  </>
                )}
              </>
            )}
            {data.func === "TIMER" && (
              <p>{data["ctrls"][`TIMER_${data.label}_sleep_time`]["value"]}s</p>
            )}
            {data.func === "LOOP" && (
              <div>
                <p>{`${current_iteration}/${total_iteration}`}</p>
              </div>
            )}
          </div>
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
  );
};

export default ConditionalNode;
