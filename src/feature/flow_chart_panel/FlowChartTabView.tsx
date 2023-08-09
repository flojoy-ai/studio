import { useFlowChartState } from "@hooks/useFlowChartState";
import { useMantineTheme } from "@mantine/core";
import PYTHON_FUNCTIONS from "@src/data/pythonFunctions.json";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useSocket } from "@src/hooks/useSocket";
import { nodeSection } from "@src/utils/ManifestLoader";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import localforage from "localforage";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ConnectionLineType,
  EdgeTypes,
  MiniMap,
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
import { useFlowChartTabState } from "./FlowChartTabState";
import { useAddNewNode } from "./hooks/useAddNewNode";
import { NodeExpandMenu } from "./views/NodeExpandMenu";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { ACTIONS_HEIGHT, Layout } from "../common/Layout";
import { getEdgeTypes, isCompatibleType } from "@src/utils/TypeCheck";
import { notifications } from "@mantine/notifications";
import { CenterObserver } from "./components/CenterObserver";
import { CommandMenu } from "../command/CommandMenu";
import useNodeTypes from "./hooks/useNodeTypes";
import { Separator } from "@src/components/ui/separator";
import { Eraser, Workflow } from "lucide-react";
import { IconButton } from "../common/IconButton";
import { GalleryModal } from "@src/components/gallery/GalleryModal";
import { Toaster } from "sonner";
import { useTheme } from "@src/components/theme-provider";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);

  const { theme } = useTheme();

  const { isSidebarOpen, setIsSidebarOpen, setRfInstance, setIsEditMode } =
    useFlowChartState();

  const mantineTheme = useMantineTheme();

  const {
    states: { programResults },
  } = useSocket();

  const {
    nodeLabel,
    nodeType,
    pythonString,
    setPythonString,
    nodeFilePath,
    setNodeFilePath,
    setNodeLabel,
    setNodeType,
  } = useFlowChartTabState();

  const { nodes, setNodes, edges, setEdges, selectedNode, unSelectedNodes } =
    useFlowChartGraph();

  const getNodeFuncCount = useCallback(
    (func: string) => {
      return nodes.filter((n) => n.data.func === func).length;
    },
    // including nodes variable in dependency list would cause excessive re-renders
    // as nodes variable is updated so frequently
    // using nodes.length is more efficient for this case
    // adding eslint-disable-next-line react-hooks/exhaustive-deps to suppress eslint warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes.length]
  );

  const addNewNode = useAddNewNode(setNodes, getNodeFuncCount);

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
    wrapperOnClick: () => setIsEditMode(true),
    theme: mantineTheme.colorScheme,
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

  // useKeyboardShortcut("ctrl", "0", () => deselectAllNodeShortcut());
  // useKeyboardShortcut("ctrl", "9", () => deselectNodeShortcut());
  //
  // useKeyboardShortcut("meta", "0", () => deselectAllNodeShortcut());
  // useKeyboardShortcut("meta", "9", () => deselectNodeShortcut());

  const nodeToEdit =
    nodes.filter((n) => n.selected).length > 1 ? null : selectedNode;

  return (
    <Layout>
      <div className="sm:px-8" style={{ height: ACTIONS_HEIGHT }}>
        <div className="py-1" />
        <div className="flex">
          <IconButton
            icon={Workflow}
            onClick={toggleSidebar}
            data-testid="add-node-button"
            variant="ghost"
          >
            Add Node
          </IconButton>
          <GalleryModal
            isGalleryOpen={isGalleryOpen}
            setIsGalleryOpen={setIsGalleryOpen}
          />
          <div className="grow" />
          <IconButton
            icon={Eraser}
            onClick={clearCanvas}
            data-testid="clear-canvas-button"
            variant="ghost"
          >
            Clear Canvas
          </IconButton>
        </div>
        <div className="py-1" />
        <Separator />
      </div>

      <Sidebar
        sections={nodeSection}
        leafNodeClickHandler={addNewNode as LeafClickHandler}
        isSideBarOpen={isSidebarOpen}
        setSideBarStatus={setIsSidebarOpen}
      />

      <Toaster theme={theme} />

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
            setNodes={setNodes}
            setNodeModalOpen={() => setNodeModalOpen(true)}
            handleDelete={handleNodeRemove}
          />

          <FlowChartKeyboardShortcuts />
          <CenterObserver />

          <ReactFlow
            id="flow-chart"
            style={{
              position: "fixed",
              height: "100%",
              width: "50%",
              textAlign: "center",
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
                  mantineTheme.colorScheme === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              nodeColor={
                mantineTheme.colorScheme === "light"
                  ? "rgba(0, 0, 0, 0.25)"
                  : "rgba(255, 255, 255, 0.25)"
              }
              maskColor={
                mantineTheme.colorScheme === "light"
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
            closeModal={() => setNodeModalOpen(false)}
            modalIsOpen={nodeModalOpen}
            nodeResults={programResults}
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
