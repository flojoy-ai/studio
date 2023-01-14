import { FC, useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
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
} from "reactflow";

import localforage from "localforage";

import CustomEdge from "./views/CustomEdge";
import CustomNode from "./views/CustomNode";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";
import styledPlotLayout from "../common/defaultPlotLayout";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import NodeModal from "./views/NodeModal";
import { FlowChartProps } from "./types/FlowChartProps";
import { useFlowChartTabState } from "./FlowChartTabState";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const defaultPythonFnLabel = "PYTHON FUNCTION";
const defaultPythonFnType = "PYTHON FUNCTION TYPE";

const FlowChartTab = ({
  results,
  theme,
  rfInstance,
  setRfInstance,
  clickedElement,
  setClickedElement,
  nodes,
  setNodes,
  edges,
  setEdges,
}: FlowChartProps) => {
  const { windowWidth, modalIsOpen, openModal, afterOpenModal, closeModal } =
    useFlowChartTabState();
  const edgeTypes: EdgeTypes = useMemo(
    () => ({ default: CustomEdge as any }),
    []
  );
  const nodeTypes: NodeTypes = useMemo(
    () => ({ default: CustomNode as any }),
    []
  );

  const modalStyles = {
    overlay: { zIndex: 99 },
    content: { zIndex: 100 },
  };

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setClickedElement(node);
    openModal();
  };

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  let nodeLabel = defaultPythonFnLabel;
  let nodeType = defaultPythonFnType;

  if (clickedElement) {
    if ("data" in clickedElement) {
      if ("label" in clickedElement.data && "type" in clickedElement.data) {
        if (
          clickedElement.data.label !== undefined &&
          clickedElement.data.type !== undefined
        ) {
          nodeLabel = clickedElement.data.func;
          nodeType = clickedElement.data.type;
        }
      }
    }
  }

  const pythonString =
    nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
      ? "..."
      : PYTHON_FUNCTIONS[nodeType][nodeLabel + ".py"];

  let nd: any = {};

  if (results && "io" in results) {
    const runResults = results.io; // JSON.parse(results.io);
    const filteredResult = runResults.filter(
      (node: any) => node.id === clickedElement.id
    )[0];

    nd = filteredResult === undefined ? {} : filteredResult;
  }

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
  const handleNodeDrag:NodeDragHandler = (_, node) => {
    setNodes((nodes) => {
      const nodeIndex = nodes.findIndex((el) => el.id === node.id);
      nodes[nodeIndex] = node;
    });
  };
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  return (
    <ReactFlowProvider>
      <div style={{ height: `99vh` }} data-testid="react-flow">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.Step}
          onInit={onInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={handleNodeDrag}
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
