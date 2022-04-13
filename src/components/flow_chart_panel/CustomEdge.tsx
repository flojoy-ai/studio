import { EdgeProps, getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const edgePath = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd('arrow');

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
    </>
  );
};

export default CustomEdge;
