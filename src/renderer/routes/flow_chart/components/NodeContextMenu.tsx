import { useFlowChartState } from '@src/hooks/useFlowChartState';
import { useStore } from 'reactflow';

type ContextMenuProps = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onClick?: () => void;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick
}: ContextMenuProps) {
  // const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const { setIsEditMode } = useFlowChartState();
  const { resetSelectedElements, addSelectedNodes } = useStore(state => ({ resetSelectedElements: state.resetSelectedElements, addSelectedNodes: state.addSelectedNodes }));
  const editNode = () => {
    resetSelectedElements();
    addSelectedNodes([id])
    setIsEditMode(true);
  }

  // const duplicateNode = useCallback(() => {
  //   const node = getNode(id);
  //   if (!node) {
  //     return;
  //   }
  //   const position = {
  //     x: node.position.x + 50,
  //     y: node.position.y +j50,
  //   };
  //
  //   addNodes({ ...node, id: `${node.id}-copy`, position });
  // }, [id, getNode, addNodes]);
  //
  // const deleteNode = useCallback(() => {
  //   setNodes((nodes) => nodes.filter((node) => node.id !== id));
  //   setEdges((edges) => edges.filter((edge) => edge.source !== id));
  // }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 bg-background border"
      onClick={onClick}
    >
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={editNode}>edit</button>
      {/* <button onClick={duplicateNode}>duplicate</button> */}
      {/* <button onClick={deleteNode}>delete</button> */}
    </div>
  );
}

