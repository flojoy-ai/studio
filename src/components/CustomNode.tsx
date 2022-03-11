import { FC } from 'react';
import { Handle, Position, getMarkerEnd } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
  };

const CustomNode = ({ data }) => {
  return (
    <div style={customNodeStyles}>
      <Handle type="target" position={Position.Left} style={{ borderRadius: 0 }} />
      <Handle type="source" position={Position.Right} style={{ borderRadius: 0 }} />
      <div>{data.label}</div>
    </div>
  );
};

export default CustomNode;
