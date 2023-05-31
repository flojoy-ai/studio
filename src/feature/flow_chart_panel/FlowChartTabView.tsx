import { useCallback, useEffect, useMemo } from "react";
import {
  ConnectionLineType,
  EdgeTypes,
  NodeDragHandler,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnInit,
  OnNodesChange,
  OnNodesDelete,
  ReactFlow,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";

import localforage from "localforage";

import { AddNodeBtn } from "@src/AddNodeBtn";
import { Layout } from "@src/Layout";
import { nodeConfigs } from "@src/configs/NodeConfigs";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { useFlowChartTabState } from "./FlowChartTabState";
import SidebarCustomContent from "./components/SidebarCustomContent";
import { ClearCanvasBtn } from "./components/clear-canvas-btn/ClearCanvasBtn";
import { useAddNewNode } from "./hooks/useAddNewNode";
import { CMND_MANIFEST_MAP, CMND_TREE } from "./manifest/COMMANDS_MANIFEST";
import { CustomNodeProps } from "./types/CustomNodeProps";
import { NodeExpandMenu } from "./views/NodeExpandMenu";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import Sidebar from "../common/Sidebar/Sidebar";
import { Box, useMantineTheme } from "@mantine/core";
import { useFlowChartState } from "@hooks/useFlowChartState";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab = () => {
  const { isSidebarOpen, setIsSidebarOpen, setRfInstance } =
    useFlowChartState();
  const theme = useMantineTheme();

  const {
    states: { programResults },
  } = useSocket();

  const {
    windowWidth,
    modalIsOpen,
    closeModal,
    nd,
    nodeLabel,
    nodeType,
    pythonString,
    setPythonString,
    nodeFilePath,
    setNodeFilePath,
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
    unSelectedNodes,
  } = useFlowChartGraph();

  const getNodeFuncCount = useCallback(
    (func: string) => {
      console.log(nodes);
      return nodes.filter((n) => n.data.func === func).length;
    },
    [nodes.length]
  );

  const addNewNode = useAddNewNode(setNodes, getNodeFuncCount);
  const sidebarCustomContent = useMemo(
    () => <SidebarCustomContent onAddNode={addNewNode} />,
    [nodes, edges]
  );

  const handleNodeRemove = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({ default: SmartBezierEdge }),
    []
  );
  // Attach a callback to each of the custom nodes.
  // This is to pass down the setNodes/setEdges functions as props for deleting nodes.
  // Has to be passed through the data prop because passing as a regular prop doesn't work
  // for whatever reason.
  const nodeTypes: NodeTypes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(nodeConfigs).map(([key, CustomNode]) => {
          return [
            key,
            ({ data }: CustomNodeProps) => (
              <CustomNode data={{ ...data, handleRemove: handleNodeRemove }} />
            ),
          ];
        })
      ),
    []
  );

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
    const nodeFileName = `${selectedNode?.data.func}.py`;
    const nodeFileData = PYTHON_FUNCTIONS[nodeFileName] ?? {};
    setNodeFilePath(nodeFileData.path ?? "");
    setPythonString(nodeFileData.metadata ?? "");
    setNodeLabel(selectedNode.data.label);
    setNodeType(selectedNode.data.type);
  }, [selectedNode]);

  const proOptions = { hideAttribution: true };

  useFlowChartTabEffects({
    results: programResults,
    closeModal,
    defaultPythonFnLabel,
    defaultPythonFnType,
    modalIsOpen,
    nd,
    nodeLabel,
    nodeType,
    pythonString,
    nodeFilePath,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
    setPythonString,
    setNodeFilePath,
    windowWidth,
    selectedNode
  });

  return (
    <Layout>
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
          style={{ height: "calc(100vh - 100px)" }}
          data-testid="react-flow"
          data-rfinstance={JSON.stringify(nodes)}
        >
          <NodeEditMenu
            selectedNode={selectedNode}
            unSelectedNodes={unSelectedNodes}
          />

          <ReactFlow
            style={{
              position: "fixed",
              height: "100%",
              width: "50%",
            }}
            proOptions={proOptions}
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
            <Box
              className="top-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <AddNodeBtn setIsSidebarOpen={setIsSidebarOpen} />
              <ClearCanvasBtn setNodes={setNodes} setEdges={setEdges} />
            </Box>
            <MiniMap
              style={{
                backgroundColor:
                  theme.colorScheme === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              nodeColor={
                theme.colorScheme === "light"
                  ? "rgba(0, 0, 0, 0.25)"
                  : "rgba(255, 255, 255, 0.25)"
              }
              maskColor={
                theme.colorScheme === "light"
                  ? "rgba(0, 0, 0, 0.05)"
                  : "rgba(255, 255, 255, 0.05)"
              }
              zoomable
              pannable
            />
          </ReactFlow>

          <NodeExpandMenu
            selectedNode={selectedNode}
            closeModal={closeModal}
            modalIsOpen={modalIsOpen}
            nd={nd}
            nodeLabel={nodeLabel}
            nodeType={nodeType}
            pythonString={pythonString}
            nodeFilePath={nodeFilePath}
          />
        </div>
      </ReactFlowProvider>
    </Layout>
  );
};

export default FlowChartTab;
