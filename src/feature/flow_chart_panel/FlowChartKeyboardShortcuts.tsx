import ReactFlow, {
  ConnectionLineType,
  Edge,
  NodeTypes,
  OnNodesDelete,
  Node,
  useReactFlow,
  EdgeTypes,
  OnInit,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeDragHandler,
} from "reactflow";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { AddNodeBtn } from "@src/AddNodeBtn";
import { ClearCanvasBtn } from "./components/clear-canvas-btn/ClearCanvasBtn";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import "reactflow/dist/style.css";

type FlowChartKeyboardShortcutsProps = {
  nodes: Node<ElementsData>[];
  nodeTypes: NodeTypes;
  edges: Edge[];
  edgeTypes: EdgeTypes;
  onInit: OnInit;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  handleNodeDrag: NodeDragHandler;
  handleNodesDelete: OnNodesDelete;
};

const FlowChartKeyboardShortcuts = ({
  nodes,
  nodeTypes,
  edges,
  edgeTypes,
  onInit,
  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDrag,
  handleNodesDelete,
}: FlowChartKeyboardShortcutsProps) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  useKeyboardShortcut("ctrl", "=", zoomIn);
  useKeyboardShortcut("ctrl", "-", zoomOut);
  useKeyboardShortcut("ctrl", "1", fitView)

  const { setIsSidebarOpen } = useFlowChartState();
  const { setNodes, setEdges } = useFlowChartGraph();

  return (
    <ReactFlow
      style={{
        position: "fixed",
        height: "100%",
        width: "50%",
      }}
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      edgeTypes={edgeTypes}
      connectionLineType={ConnectionLineType.Step}
      onInit={onInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={handleNodeDrag}
      onNodesDelete={handleNodesDelete}
    >
      <div
        className="top-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          zIndex: 100,
        }}
      >
        <AddNodeBtn setIsSidebarOpen={setIsSidebarOpen} />
        <ClearCanvasBtn setNodes={setNodes} setEdges={setEdges} />
      </div>
    </ReactFlow>
  );
};

export default FlowChartKeyboardShortcuts;
