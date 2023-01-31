import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import { useEffect, useState } from "react";
import HandleComponent from "../components/HandleComponent";
import "../style/defaultNode.css";
const DeafultNode = ({ data }) => {
  const [additionalInfo, setAdditionalInfo] = useState({});

  const { uiTheme, runningNode, failedNode, nodes } = useFlowChartState();
  console.log('nodes: ', nodes)
  const params = data.inputs || [];

  const { states } = useSocket();
  const { programResults } = states!;

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
        ...(runningNode === data.id && { boxShadow: "0 0 50px 15px #48abe0" }),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
      }}
    >
      <div
        className="default_node"
        style={{
          position: "relative",
          color: uiTheme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
          backgroundColor:
            uiTheme === "light" ? "rgb(123 97 255 / 16%)" : "#99f5ff4f",
          border:
            uiTheme === "light"
              ? "1px solid rgba(123, 97, 255, 1)"
              : "1px solid #99F5FF",
          height: "fit-content",
          minHeight: 115,
          minWidth:115,
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
  );
};

export default DeafultNode;
