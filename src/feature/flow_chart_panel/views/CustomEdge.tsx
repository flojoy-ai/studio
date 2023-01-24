import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { FC } from "react";
import {
  EdgeProps,
  getBezierPath,
  getMarkerEnd,
  ArrowHeadType,
} from "react-flow-renderer";

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(ArrowHeadType.Arrow);

  const { uiTheme } = useFlowChartState();

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{
            fontSize: "30px",
            fill: uiTheme === "dark" ? "white" : "black",
          }}
          startOffset="50%"
          textAnchor="middle"
        >
          {label}
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
