import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import {
  AddBGTemplate,
  AddSvg,
  AtSvg,
  MultiplySvg,
  SubSvg,
} from "../../svgs/add-multiply-svg";
import NodeWrapper from "../wrapper/NodeWrapper";

const ArithmeticNode = ({ data }: CustomNodeProps) => {
  const params = data.inputs || [];

  return (
    <NodeWrapper data={data}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <AddBGTemplate />
          {data.func === "MULTIPLY" && (
            <MultiplySvg
              style={{
                position: "absolute",
                top: "47px",
                left: "29px",
                height: "19px",
                width: "18px",
              }}
            />
          )}
          {data.func === "ADD" && (
            <AddSvg
              style={{
                position: "absolute",
                top: "47px",
                left: "29px",
                height: "19px",
                width: "18px",
              }}
            />
          )}
          {data.func === "SUBTRACT" && (
            <SubSvg
              style={{
                position: "absolute",
                top: "47px",
                left: "29px",
                height: "19px",
                width: "18px",
              }}
            />
          )}

          {data.func === "MATMUL" && (
            <AtSvg
              style={{
                position: "absolute",
                top: "47px",
                left: "29px",
                height: "19px",
                width: "18px",
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HandleComponent data={data} inputs={params} />
      </div>
    </NodeWrapper>
  );
};

export default ArithmeticNode;
