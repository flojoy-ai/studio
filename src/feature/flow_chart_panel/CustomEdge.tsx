import { FC } from "react";
import {
  EdgeProps,
  getSmoothStepPath,
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
}) => {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(ArrowHeadType.Arrow);

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
          style={{ fontSize: '12px' }}
          startOffset="50%"
          textAnchor="middle"
        >
          "CustomEdge"
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
