import { useCallback, useEffect, useMemo } from "react";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  ConnectionLineType,
  OnNodesChange,
  applyNodeChanges,
  applyEdgeChanges,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  EdgeTypes,
  OnInit,
  NodeMouseHandler,
  NodeDragHandler,
  OnNodesDelete,
  BezierEdge,
} from "reactflow";

import localforage from "localforage";

import styledPlotLayout from "../common/defaultPlotLayout";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import NodeModal from "./views/NodeModal";
import { FlowChartProps } from "./types/FlowChartProps";
import { useFlowChartTabState } from "./FlowChartTabState";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { nodeConfigs } from "@src/configs/NodeConfigs";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab: React.FC<FlowChartProps> = ({
  results,
  theme,
  rfInstance,
  setRfInstance,
  clickedElement,
  setClickedElement,
}: FlowChartProps) => {
  const {
    windowWidth,
    modalIsOpen,
    openModal,
    afterOpenModal,
    closeModal,
    nd,
    nodeLabel,
    nodeType,
    pythonString,
    setPythonString,
    defaultPythonFnLabel,
    defaultPythonFnType,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
  } = useFlowChartTabState();

  const { nodes, setNodes, edges, setEdges } = useFlowChartState();

  const edgeTypes: EdgeTypes = useMemo(() => ({ default: BezierEdge }), []);
  const nodeTypes: NodeTypes = useMemo(() => nodeConfigs, []);

  const modalStyles = {
    overlay: { zIndex: 99 },
    content: { zIndex: 100 },
  };

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setPythonString(
      nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
        ? "..."
        : PYTHON_FUNCTIONS[nodeLabel + ".py"]
    );
    setClickedElement(node);
    openModal();
  };

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  const defaultLayout = styledPlotLayout(theme);

  const onInit: OnInit = (rfIns) => {
    const flowSize = 1107;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;
    rfIns.fitView();

    rfIns.setViewport({
      x: xPosition,
      y: 61,
      zoom: 0.7,
    });

    setRfInstance(rfIns.toObject());
  };
  const handleNodeDrag: NodeDragHandler = (_, node) => {
    setNodes((nodes) => {
      const nodeIndex = nodes.findIndex((el) => el.id === node.id);
      nodes[nodeIndex] = node;
    });
  };
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((ns) => applyNodeChanges(changes, ns));
    },
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      const selectedNodeIds = nodes.map((node) => node.id);
      setNodes((prev) =>
        prev.filter((node) => !selectedNodeIds.includes(node.id))
      );
    },
    [setNodes]
  );

  useFlowChartTabEffects({
    clickedElement,
    results,
    afterOpenModal,
    closeModal,
    defaultPythonFnLabel,
    defaultPythonFnType,
    modalIsOpen,
    nd,
    nodeLabel,
    nodeType,
    openModal,
    pythonString,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
    setPythonString,
    windowWidth,
  });
  return (
    <ReactFlowProvider>
      <div
        style={{ height: `99vh` }}
        data-testid="react-flow"
        data-rfinstance={JSON.stringify(nodes)}
      >
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
          onNodeDoubleClick={onNodeClick}
          onNodeDragStop={handleNodeDrag}
          onNodesDelete={handleNodesDelete}
        />
      </div>

      <NodeModal
        afterOpenModal={afterOpenModal}
        clickedElement={clickedElement}
        closeModal={closeModal}
        defaultLayout={defaultLayout}
        modalIsOpen={modalIsOpen}
        modalStyles={modalStyles}
        nd={nd}
        nodeLabel={nodeLabel}
        nodeType={nodeType}
        pythonString={pythonString}
        theme={theme}
      />
    </ReactFlowProvider>
  );
};
export default FlowChartTab;
