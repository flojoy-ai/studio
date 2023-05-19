import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ConnectionLineType,
  EdgeTypes,
  NodeDragHandler,
  NodeMouseHandler,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnInit,
  OnNodesChange,
  OnNodesDelete,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";

import localforage from "localforage";

import { useFlowChartState } from "@hooks/useFlowChartState";
import { AddNodeBtn } from "@src/AddNodeBtn";
import { Layout } from "@src/Layout";
import { nodeConfigs } from "@src/configs/NodeConfigs";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import { useSearchParams } from "react-router-dom";
import { BezierEdge, Node } from "reactflow";
import Sidebar from "../common/Sidebar/Sidebar";
import usePlotLayout from "../common/usePlotLayout";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { useFlowChartTabState } from "./FlowChartTabState";
import { RequestNode } from "./components/RequestNode";
import { ClearCanvasBtn } from "./components/clear-canvas-btn/ClearCanvasBtn";
import { useAddNewNode } from "./hooks/useAddNewNode";
import { CMND_MANIFEST_MAP, CMND_TREE } from "./manifest/COMMANDS_MANIFEST";
import NodeModal from "./views/NodeModal";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab = () => {
  const [searchParams] = useSearchParams();
  const [clickedElement, setClickedElement] = useState<Node | undefined>(
    undefined
  );
  const { isSidebarOpen, setIsSidebarOpen, setRfInstance, setCtrlsManifest } =
    useFlowChartState();

  const {
    states: { programResults },
  } = useSocket();

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

  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNode,
    loadFlowExportObject,
  } = useFlowChartGraph();

  const addNewNode = useAddNewNode(setNodes);
  const sidebarCustomContent = useMemo(() => <RequestNode />, []);

  // TODO: Add smart edge back?
  const edgeTypes: EdgeTypes = useMemo(() => ({ default: BezierEdge }), []);
  const nodeTypes: NodeTypes = useMemo(() => nodeConfigs, []);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setPythonString(
      nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
        ? "..."
        : PYTHON_FUNCTIONS[nodeLabel + ".py"]
    );
    setClickedElement(node);
    openModal();
  };

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
      selectedNodeIds.forEach((id) => {
        setEdges((prev) =>
          prev.filter((edge) => edge.source !== id && edge.target !== id)
        );
      });
    },
    [setNodes]
  );

  const fetchExampleApp = useCallback(
    async (fileName: string) => {
      const res = await fetch(`/example-apps/${fileName}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setCtrlsManifest(data.ctrlsManifest);
      const flow = data.rfInstance;
      loadFlowExportObject(flow);
    },
    [loadFlowExportObject, setCtrlsManifest]
  );

  useEffect(() => {
    const filename = searchParams.get("test_example_app");
    if (filename) {
      fetchExampleApp(filename);
    }
  }, []);

  useFlowChartTabEffects({
    clickedElement,
    results: programResults,
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
    <Layout>
      <div
        className="top-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <AddNodeBtn setIsSidebarOpen={setIsSidebarOpen} />
        <ClearCanvasBtn setNodes={setNodes} />
      </div>
      <Sidebar
        sections={CMND_TREE}
        manifestMap={CMND_MANIFEST_MAP}
        leafNodeClickHandler={addNewNode}
        isSideBarOpen={isSidebarOpen}
        setSideBarStatus={setIsSidebarOpen}
        customContent={sidebarCustomContent}
      />
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
            onNodeDoubleClick={onNodeClick}
            onNodeDragStop={handleNodeDrag}
            onNodesDelete={handleNodesDelete}
          />
        </div>
        {nd && (
          <NodeModal
            afterOpenModal={afterOpenModal}
            clickedElement={clickedElement}
            closeModal={closeModal}
            defaultLayout={defaultLayout}
            modalIsOpen={modalIsOpen}
            nd={nd}
            nodeLabel={nodeLabel}
            nodeType={nodeType}
            pythonString={pythonString}
          />
        )}
      </ReactFlowProvider>
    </Layout>
  );
};

export default FlowChartTab;
