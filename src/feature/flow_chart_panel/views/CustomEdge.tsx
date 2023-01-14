import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { FC } from "react";
import {
  EdgeProps,
  getBezierPath,
  getMarkerEnd,
  MarkerType,
} from 'reactflow';

const CustomEdge: FC<EdgeProps> = (edgeParams) => {
  const [path] = getBezierPath(edgeParams);
  const markerEnd = getMarkerEnd(MarkerType.Arrow)
  const {uiTheme} = useFlowChartState();

  return (
    <>
      <path
        id={edgeParams.id}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${edgeParams.id}`}
          style={{ fontSize: '30px',fill: uiTheme == 'dark' ? 'white' : 'black' }}
          startOffset="50%"
          textAnchor="middle"
        >
          {edgeParams.label}
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
