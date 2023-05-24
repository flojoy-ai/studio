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
} from "reactflow";

import localforage from "localforage";

import usePlotLayout from "../common/usePlotLayout";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import NodeModal from "./views/NodeModal";
import { FlowChartProps } from "./types/FlowChartProps";
import { useFlowChartTabState } from "./FlowChartTabState";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { nodeConfigs } from "@src/configs/NodeConfigs";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useMantineColorScheme, useMantineTheme } from "@mantine/styles";
import { NodeExpandMenu } from "./views/NodeExpandMenu";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab = ({
  results,
  rfInstance,
  setRfInstance,
  clickedElement,
  setClickedElement,
}: FlowChartProps) => {
  const {
    windowWidth,
    modalIsOpen,
    closeModal,
    nd,
    nodeLabel,
    nodeType,
    pythonString,
    setPythonString,
    nodeFileName,
    setNodeFileName,
    defaultPythonFnLabel,
    defaultPythonFnType,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
  } = useFlowChartTabState();

  const { isExpandMode, nodes, setNodes, edges, setEdges } =
    useFlowChartState();
  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedNode = selectedNodes.length > 0 ? selectedNodes[0] : null;

  const edgeTypes: EdgeTypes = useMemo(
    () => ({ default: SmartBezierEdge }),
    []
  );
  const nodeTypes: NodeTypes = useMemo(() => nodeConfigs, []);

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  const defaultLayout = usePlotLayout();

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

  useEffect(() => {
    if (selectedNode === null) {
      return;
    }
    let nodeFileName =
      selectedNode?.data.label === defaultPythonFnLabel ||
      selectedNode?.data.type === defaultPythonFnType
        ? "..."
        : selectedNode?.data.label + ".py";

    if (selectedNode.data.func === "CONSTANT") {
      nodeFileName = selectedNode.data.func + ".py";
    }
    let pythonString = PYTHON_FUNCTIONS[nodeFileName];
    
    setNodeFileName(nodeFileName);
    setPythonString(pythonString);
    setNodeLabel(selectedNode.data.label);
    setNodeType(selectedNode.data.type);
  }, [selectedNode]);

  useFlowChartTabEffects({
    clickedElement,
    results,
    closeModal,
    defaultPythonFnLabel,
    defaultPythonFnType,
    modalIsOpen,
    nd,
    nodeLabel,
    nodeType,
    pythonString,
    nodeFileName,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
    setPythonString,
    setNodeFileName,
    windowWidth,
  });
  return (
    <ReactFlowProvider>
      <div
        style={{ height: "calc(100vh - 110px)" }}
        data-testid="react-flow"
        data-rfinstance={JSON.stringify(nodes)}
      >
        <NodeEditMenu selectedNode={selectedNode} />

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
        />

        <NodeExpandMenu
          clickedElement={selectedNode}
          closeModal={closeModal}
          defaultLayout={defaultLayout}
          modalIsOpen={modalIsOpen}
          nd={nd!}
          nodeLabel={nodeLabel}
          nodeType={nodeType}
          pythonString={pythonString}
          nodeFileName={nodeFileName}
        />
      </div>
    </ReactFlowProvider>
  );
};
export default FlowChartTab;
