import { useFlowChartState } from "@hooks/useFlowChartState";
import { Text, useMantineTheme } from "@mantine/core";
import PYTHON_FUNCTIONS from "@src/data/pythonFunctions.json";
import IconButton from "@src/feature/common/IconButton";
import TabActions from "@src/feature/common/TabActions";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useSocket } from "@src/hooks/useSocket";
import { nodeSection } from "@src/utils/ManifestLoader";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import localforage from "localforage";
import { useCallback, useEffect, useMemo } from "react";
import {
  ConnectionLineType,
  EdgeTypes,
  MiniMap,
  Node,
  NodeDragHandler,
  OnConnect,
  OnEdgesChange,
  OnInit,
  OnNodesChange,
  OnNodesDelete,
  ReactFlow,
  ReactFlowProvider,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import Sidebar, { LeafClickHandler } from "../common/Sidebar/Sidebar";
import FlowChartKeyboardShortcuts from "./FlowChartKeyboardShortcuts";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { useFlowChartTabState } from "./FlowChartTabState";
import SidebarCustomContent from "./components/SidebarCustomContent";
import { useAddNewNode } from "./hooks/useAddNewNode";
import { ElementsData } from "./types/CustomNodeProps";
import { NodeExpandMenu } from "./views/NodeExpandMenu";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { Layout } from "../common/Layout";
import { getEdgeTypes, isCompatibleType } from "@src/utils/TypeCheck";
import { notifications } from "@mantine/notifications";
import { CenterObserver } from "./components/CenterObserver";
import { CommandMenu } from "../command/CommandMenu";
import useNodeTypes from "./hooks/useNodeTypes";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    setRfInstance,
    setIsEditMode,
    setIsExpandMode,
  } = useFlowChartState();

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

  const { nodes, setNodes, edges, setEdges, selectedNode, unSelectedNodes } =
    useFlowChartGraph();

  const getNodeFuncCount = useCallback(
    (func: string) => {
      return nodes.filter((n) => n.data.func === func).length;
    },
    [nodes.length]
  );

  const addNewNode = useAddNewNode(setNodes, getNodeFuncCount);
  const sidebarCustomContent = useMemo(() => <SidebarCustomContent />, []);

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [setIsSidebarOpen]
  );

  const handleNodeRemove = useCallback(
    (nodeId: string, nodeLabel: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      sendEventToMix("Node Deleted", nodeLabel, "nodeTitle");
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
  const nodeTypes = useNodeTypes({
    handleRemove: handleNodeRemove,
    handleClickExpand: () => {
      setIsModalOpen(true);
      setIsExpandMode(true);
    },
    wrapperOnClick: () => setIsEditMode(true),
    theme: theme.colorScheme,
  });
  const onInit: OnInit = (rfIns) => {
    rfIns.fitView();
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
    (connection) =>
      setEdges((eds) => {
        const [sourceType, targetType] = getEdgeTypes(connection);
        if (isCompatibleType(sourceType, targetType)) {
          return addEdge(connection, eds);
        }

        notifications.show({
          id: "type-error",
          color: "red",
          title: "Type Error",
          message: `Source type ${sourceType} and target type ${targetType} are not compatible`,
          autoClose: true,
          withCloseButton: true,
        });
      }),
    [setEdges]
  );
  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      nodes.forEach((node) => {
        sendEventToMix("Node Deleted", node.data.label, "nodeTitle");
      });
      const selectedNodeIds = nodes.map((node) => node.id);
      setNodes((prev) =>
        prev.filter((node) => !selectedNodeIds.includes(node.id))
      );
    },
    [setNodes]
  );

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

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
  }, [
    selectedNode,
    setNodeFilePath,
    setNodeLabel,
    setNodeType,
    setPythonString,
  ]);

  const proOptions = { hideAttribution: true };

  const selectAllNodesShortcut = () => {
    setNodes((nodes) => {
      nodes.forEach((node) => {
        node.selected = true;
      });
    });
  };

  const deselectAllNodeShortcut = () => {
    setNodes((nodes) => {
      nodes.forEach((node) => {
        node.selected = false;
      });
    });
  };

  const deselectNodeShortcut = () => {
    setNodes((nodes) => {
      nodes.forEach((node) => {
        if (selectedNode !== null && node.id === selectedNode.id) {
          node.selected = false;
        }
      });
    });
  };

  useKeyboardShortcut("ctrl", "a", () => selectAllNodesShortcut());
  useKeyboardShortcut("ctrl", "0", () => deselectAllNodeShortcut());
  useKeyboardShortcut("ctrl", "9", () => deselectNodeShortcut());

  useKeyboardShortcut("meta", "a", () => selectAllNodesShortcut());
  useKeyboardShortcut("meta", "0", () => deselectAllNodeShortcut());
  useKeyboardShortcut("meta", "9", () => deselectNodeShortcut());

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

  const plusIcon = useMemo(
    () => <IconPlus size={16} color={theme.colors.accent1[0]} />,
    [theme]
  );

  const minusIcon = useMemo(
    () => <IconMinus size={16} color={theme.colors.accent1[0]} />,
    [theme]
  );

  return (
    <Layout>
      <TabActions>
        <IconButton
          onClick={toggleSidebar}
          icon={plusIcon}
          data-testid="add-node-button"
        >
          <Text size="sm">Add Python Function</Text>
        </IconButton>
        <IconButton
          data-testid="clear-canvas-button"
          onClick={clearCanvas}
          icon={minusIcon}
          ml="auto"
          h="100%"
        >
          <Text size="sm">Clear Canvas</Text>
        </IconButton>
      </TabActions>
      <Sidebar
        sections={nodeSection}
        leafNodeClickHandler={addNewNode as LeafClickHandler}
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
            selectedNode={
              nodes.filter((n) => n.selected).length > 1 ? null : selectedNode
            }
            unSelectedNodes={unSelectedNodes}
            nodes={nodes}
            setNodes={(nodes: Node<ElementsData>[]) => {
              setNodes(nodes);
            }}
          />

          <FlowChartKeyboardShortcuts />
          <CenterObserver />

          <ReactFlow
            id="flow-chart"
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
            fitView
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
            <Controls />
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
      <CommandMenu />
    </Layout>
  );
};

export default FlowChartTab;
