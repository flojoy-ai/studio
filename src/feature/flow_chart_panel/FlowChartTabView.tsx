import { useFlowChartState } from "@hooks/useFlowChartState";
import { Text, useMantineTheme } from "@mantine/core";
import { nodeConfigs } from "@src/configs/NodeConfigs";
import PYTHON_FUNCTIONS from "@src/data/pythonFunctions.json";
import { IconButton } from "@src/feature/common/IconButton";
import { Layout } from "@src/feature/common/Layout";
import { TabActions } from "@src/feature/common/TabActions";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import localforage from "localforage";
import { useCallback, useEffect, useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ConnectionLineType,
  EdgeTypes,
  MiniMap,
  NodeDragHandler,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnInit,
  OnNodesChange,
  OnNodesDelete,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";
import Sidebar from "../common/Sidebar/Sidebar";
import SidebarCustomContent from "./components/SidebarCustomContent";

import {
  CMND_TREE,
  getManifestCmdsMap,
  getManifestParams,
  ManifestParams,
} from "@src/utils/ManifestLoader";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { useFlowChartTabState } from "./FlowChartTabState";
import { useAddNewNode } from "./hooks/useAddNewNode";
import { CustomNodeProps } from "./types/CustomNodeProps";
import { NodeExpandMenu } from "./views/NodeExpandMenu";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

export const FlowChartTabLoader = () => {
  const manifestParams: ManifestParams = getManifestParams();
  return { manifestParams };
};

const FlowChartTab = () => {
  const { manifestParams } = useLoaderData() as {
    manifestParams: ManifestParams;
  };
  const { isSidebarOpen, setIsSidebarOpen, setRfInstance, setCtrlsManifest } =
    useFlowChartState();
  const theme = useMantineTheme();

  const {
    states: { programResults },
  } = useSocket();

  const [searchParams] = useSearchParams();

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
    loadFlowExportObject,
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
    [addNewNode]
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

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  useEffect(() => {
    const filename = searchParams.get("test_example_app");
    if (filename) {
      fetchExampleApp(filename);
    }
  }, []);

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
    selectedNode,
  });

  return (
    <Layout>
      <TabActions>
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          icon={<IconPlus size={16} color={theme.colors.accent1[0]} />}
        >
          <Text size="sm">Add Python Function</Text>
        </IconButton>
        <IconButton
          onClick={() => clearCanvas()}
          icon={<IconMinus size={16} color={theme.colors.accent1[0]} />}
          ml="auto"
          h="100%"
        >
          <Text size="sm">Clear Canvas</Text>
        </IconButton>
      </TabActions>
      <Sidebar
        sections={CMND_TREE}
        manifestMap={getManifestCmdsMap()}
        leafNodeClickHandler={addNewNode}
        isSideBarOpen={isSidebarOpen}
        setSideBarStatus={setIsSidebarOpen}
        customContent={sidebarCustomContent}
      />
      <ReactFlowProvider>
        <div
          style={{ height: "calc(100vh - 150px)" }}
          data-testid="react-flow"
          data-rfinstance={JSON.stringify(nodes)}
        >
          <NodeEditMenu
            selectedNode={selectedNode}
            unSelectedNodes={unSelectedNodes}
            manifestParams={manifestParams}
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
