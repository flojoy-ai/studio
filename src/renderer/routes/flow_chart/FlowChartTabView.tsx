import { projectAtom, useFlowChartState } from "@src/hooks/useFlowChartState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import { TreeNode } from "@src/utils/ManifestLoader";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionLineType,
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
  Node,
  NodeTypes,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import Sidebar, { LeafClickHandler } from "../common/Sidebar/Sidebar";
import FlowChartKeyboardShortcuts from "./FlowChartKeyboardShortcuts";
import { useFlowChartTabState } from "./FlowChartTabState";
import { useAddNewNode } from "./hooks/useAddNewNode";
import { BlockExpandMenu } from "./views/BlockExpandMenu";
import { sendEventToMix } from "@src/services/MixpanelServices";
import {
  ACTIONS_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "../common/Layout";
import { getEdgeTypes, isCompatibleType } from "@src/utils/TypeCheck";
import { CenterObserver } from "./components/CenterObserver";
import { Separator } from "@src/components/ui/separator";
import { Pencil, Text, Workflow, X } from "lucide-react";
import { GalleryModal } from "@src/components/gallery/GalleryModal";
import { toast } from "sonner";
import { useTheme } from "@src/providers/themeProvider";
import { ClearCanvasBtn } from "./components/ClearCanvasBtn";
import { Button } from "@src/components/ui/button";
import { ResizeFitter } from "./components/ResizeFitter";
import NodeEditModal from "./components/node-edit-menu/NodeEditModal";
import { useAtom } from "jotai";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";
import { useAddTextNode } from "./hooks/useAddTextNode";
import { WelcomeModal } from "./views/WelcomeModal";
import { CommandMenu } from "../command/CommandMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@src/components/ui/tooltip";
import {
  manifestChangedAtom,
  useManifest,
  useNodesMetadata,
} from "@src/hooks/useManifest";
import { ElementsData } from "@src/types";
import { createNodeId, createNodeLabel } from "@src/utils/NodeUtils";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { filterMap } from "@src/utils/ArrayUtils";
import ArithmeticNode from "@src/components/nodes/ArithmeticNode";
import ConditionalNode from "@src/components/nodes/ConditionalNode";
import DataNode from "@src/components/nodes/DataNode";
import DefaultNode from "@src/components/nodes/DefaultNode";
import IONode from "@src/components/nodes/IONode";
import LogicNode from "@src/components/nodes/LogicNode";
import NumpyNode from "@src/components/nodes/NumpyNode";
import ScipyNode from "@src/components/nodes/ScipyNode";
import VisorNode from "@src/components/nodes/VisorNode";
import { syncFlowchartWithManifest } from "@src/lib/sync";
import TextNode from "@src/components/nodes/TextNode";
import ContextMenu, { MenuInfo } from "./components/NodeContextMenu";
import { useCustomSections } from "@src/hooks/useCustomBlockManifest";

const nodeTypes: NodeTypes = {
  default: DefaultNode,
  AI_ML: DataNode,
  GENERATORS: DataNode,
  VISUALIZERS: VisorNode,
  EXTRACTORS: DefaultNode,
  TRANSFORMERS: DefaultNode,
  LOADERS: DefaultNode,
  ARITHMETIC: ArithmeticNode,
  IO: IONode,
  LOGIC_GATES: LogicNode,
  CONDITIONALS: ConditionalNode,
  SCIPY: ScipyNode,
  NUMPY: NumpyNode,
  DATA: DataNode,
  VISUALIZATION: VisorNode,
  ETL: DefaultNode,
  DSP: DefaultNode,
  CONTROL_FLOW: LogicNode,
  MATH: DefaultNode,
  HARDWARE: IONode,
  TextNode: TextNode,
};

const edgeTypes = {
  default: SmartBezierEdge,
};

const FlowChartTab = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [project, setProject] = useAtom(projectAtom);
  const { setHasUnsavedChanges } = useHasUnsavedChanges();

  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);

  const { resolvedTheme } = useTheme();

  const { isSidebarOpen, setIsSidebarOpen, isEditMode, setIsEditMode } =
    useFlowChartState();

  const { states } = useSocket();
  const { programResults, setProgramResults } = states;

  const { pythonString, setPythonString, nodeFilePath, setNodeFilePath } =
    useFlowChartTabState();

  const {
    nodes,
    setNodes,
    textNodes,
    setTextNodes,
    edges,
    setEdges,
    selectedNode,
    unSelectedNodes,
  } = useFlowChartGraph();
  const nodesMetadataMap = useNodesMetadata();
  const manifest = useManifest();

  const { handleImportCustomBlocks, customSections } = useCustomSections();
  const [manifestChanged, setManifestChanged] = useAtom(manifestChangedAtom);

  useEffect(() => {
    if (manifest && nodesMetadataMap && manifestChanged) {
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        nodesMetadataMap,
      );
      setNodes(syncedNodes);
      setEdges(syncedEdges);
      toast("Synced blocks with manifest.");
      setManifestChanged(false);
    }
  }, [manifest, nodesMetadataMap, manifestChanged]);

  const getTakenNodeLabels = useCallback(
    (func: string) => {
      const re = new RegExp(`^${func.replaceAll("_", " ")}( \\d+)?$`);
      const matches = filterMap(nodes, (n) => n.data.label.match(re));
      return matches;
    },
    // including nodes variable in dependency list would cause excessive re-renders
    // as nodes variable is updated so frequently
    // using nodes.length is more efficient for this case
    // adding eslint-disable-next-line react-hooks/exhaustive-deps to suppress eslint warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes.length],
  );

  const addNewNode = useAddNewNode(
    setNodes,
    getTakenNodeLabels,
    nodesMetadataMap,
  );
  const addTextNode = useAddTextNode();

  const duplicateNode = useCallback(
    (node: Node<ElementsData>) => {
      const funcName = node.data.func;
      const id = createNodeId(funcName);

      const newNode: Node<ElementsData> = {
        ...node,
        id,
        data: {
          ...node.data,
          id,
          label:
            node.data.func === "CONSTANT"
              ? node.data.ctrls["constant"].value!.toString()
              : createNodeLabel(funcName, getTakenNodeLabels(funcName)),
        },
        position: {
          x: node.position.x + 30,
          y: node.position.y + 30,
        },
        selected: true,
      };

      setNodes((prev) => {
        const original = prev.find((n) => node.id === n.id);
        if (!original) {
          throw new Error(
            "Failed to find original node when duplicating, this should not happen",
          );
        }

        original.selected = false;
        prev.push(newNode);
      });
    },
    [getTakenNodeLabels, setNodes],
  );

  const duplicateSelectedNode = useCallback(() => {
    if (selectedNode) {
      duplicateNode(selectedNode);
    }
  }, [selectedNode, duplicateNode]);

  useKeyboardShortcut("ctrl", "d", duplicateSelectedNode);
  useKeyboardShortcut("meta", "d", duplicateSelectedNode);

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [setIsSidebarOpen],
  );

  const handleNodeRemove = useCallback(
    (nodeId: string, nodeLabel: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      sendEventToMix("Node Deleted", nodeLabel, "nodeTitle");
      setHasUnsavedChanges(true);
    },
    [setNodes, setEdges, setHasUnsavedChanges],
  );

  const onInit: OnInit = (rfIns) => {
    rfIns.fitView({
      padding: 0.8,
    });
    setProject({ ...project, rfInstance: rfIns.toObject() });
  };

  const handleNodeDrag: NodeDragHandler = (_, node) => {
    setNodes((nodes) => {
      const nodeIndex = nodes.findIndex((el) => el.id === node.id);
      nodes[nodeIndex] = node;
      setHasUnsavedChanges(true);
      localStorage.setItem("prev_block_pos", "");
    });
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((ns) => applyNodeChanges(changes, ns));
      setTextNodes((ns) => applyNodeChanges(changes, ns));
    },
    [setNodes, setTextNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      sendEventToMix("Edges Changed", "");
      setEdges((es) => applyEdgeChanges(changes, es));
      if (!changes.every((c) => c.type === "select")) {
        setHasUnsavedChanges(true);
      }
    },
    [setEdges, setHasUnsavedChanges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) => {
        if (!manifest) {
          toast.error("Manifest not found, can't connect edge.");
          return;
        }

        const fullManifest = customSections ? {
          ...manifest,
          children: manifest.children.concat(customSections.children)
        } : manifest;

        const edges = getEdgeTypes(fullManifest, connection);

        if (edges.length > 0) {
          const [sourceType, targetType] = edges;
          if (isCompatibleType(sourceType, targetType)) {
            return addEdge(connection, eds);
          }

          toast.message("Type error", {
            description: `Source type ${sourceType} and target type ${targetType} are not compatible`,
          });
        }
      }),
    [setEdges, manifest, customSections],
  );

  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      nodes.forEach((node) => {
        sendEventToMix("Node Deleted", node.data.label, "nodeTitle");
      });
      const selectedNodeIds = nodes.map((node) => node.id);
      setNodes((prev) =>
        prev.filter((node) => !selectedNodeIds.includes(node.id)),
      );
      setHasUnsavedChanges(true);
    },
    [setNodes, setHasUnsavedChanges],
  );

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setTextNodes([]);
    setEdges([]);
    setHasUnsavedChanges(true);
    setProgramResults([]);

    sendEventToMix("Canvas cleared", "");
  }, [
    setNodes,
    setTextNodes,
    setEdges,
    setHasUnsavedChanges,
    setProgramResults,
  ]);

  useEffect(() => {
    if (selectedNode === null || !nodesMetadataMap) {
      return;
    }
    const nodeFileName = `${selectedNode?.data.func}.py`;
    const nodeFileData = nodesMetadataMap[nodeFileName] ?? {};
    setNodeFilePath(nodeFileData.path ?? "");
    setPythonString(nodeFileData.metadata ?? "");
  }, [selectedNode, setNodeFilePath, setPythonString, nodesMetadataMap]);

  const deleteKeyCodes = ["Delete", "Backspace"];

  const proOptions = { hideAttribution: true };

  const nodeToEdit =
    nodes.filter((n) => n.selected).length > 1 ? null : selectedNode;

  const onCommandMenuItemSelect = (node: TreeNode) => {
    addNewNode(node);
    setCommandMenuOpen(false);
  };

  const [menu, setMenu] = useState<MenuInfo | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const onNodeContextMenu = useCallback(
    (event, node: Node<ElementsData>) => {
      // Prevent native context menu from showing
      event.preventDefault();

      if (ref.current === null) {
        return;
      }
      console.log(node.id);

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top:
          event.clientY < pane.height - 200 ? event.clientY - 225 : undefined,
        left: event.clientX < pane.width - 200 ? event.clientX : undefined,
        right:
          event.clientX >= pane.width - 200
            ? pane.width - event.clientX
            : undefined,
        bottom:
          event.clientY >= pane.height - 200
            ? pane.height - event.clientY + 75
            : undefined,
      });
    },
    [setMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <>
      <ReactFlowProvider>
        <div className="mx-8 border-b" style={{ height: ACTIONS_HEIGHT }}>
          <div className="py-1" />
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    data-testid="add-block-button"
                    className="gap-2"
                    variant="ghost"
                    onClick={toggleSidebar}
                    disabled={!manifest && !customSections}
                  >
                    <Workflow size={20} className="stroke-muted-foreground" />
                    Add Block
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Try Ctrl/Cmd + K</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              data-testid="add-text-button"
              className="gap-2"
              variant="ghost"
              onClick={addTextNode}
            >
              <Text size={20} className="stroke-muted-foreground" />
              Add Text
            </Button>

            <GalleryModal
              isGalleryOpen={isGalleryOpen}
              setIsGalleryOpen={setIsGalleryOpen}
            />
            <div className="grow" />
            {selectedNode && (
              <>
                {!isEditMode ? (
                  <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => setIsEditMode(true)}
                    data-testid="toggle-edit-mode"
                  >
                    <Pencil size={18} className="stroke-muted-foreground" />
                    Edit Node
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => setIsEditMode(false)}
                  >
                    <X size={18} className="stroke-muted-foreground" />
                    Cancel Edit
                  </Button>
                )}
              </>
            )}
            <ClearCanvasBtn clearCanvas={clearCanvas} />
          </div>
          <div className="py-1" />
          <Separator />
        </div>

        <Sidebar
          sections={manifest}
          leafNodeClickHandler={addNewNode as LeafClickHandler}
          isSideBarOpen={isSidebarOpen}
          setSideBarStatus={setIsSidebarOpen}
          customSections={customSections}
          handleImportCustomBlocks={handleImportCustomBlocks}
        />

        <WelcomeModal />

        <div
          style={{
            height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT
              }px)`,
          }}
          className="relative overflow-hidden bg-background"
          data-testid="react-flow"
          id="flow-chart-area"
        >
          {nodeToEdit && isEditMode && (
            <NodeEditModal
              node={nodeToEdit}
              otherNodes={unSelectedNodes}
              setNodeModalOpen={setNodeModalOpen}
              handleDelete={handleNodeRemove}
            />
          )}

          <FlowChartKeyboardShortcuts />
          <ResizeFitter />
          <CenterObserver />

          <ReactFlow
            id="flow-chart"
            ref={ref}
            className="!absolute"
            deleteKeyCode={deleteKeyCodes}
            proOptions={proOptions}
            nodes={[...nodes, ...textNodes]}
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
            fitViewOptions={{
              padding: 0.8,
            }}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={onPaneClick}
          >
            <MiniMap
              className="!bottom-1 !bg-background"
              nodeColor={
                resolvedTheme === "light"
                  ? "rgba(0, 0, 0, 0.25)"
                  : "rgba(255, 255, 255, 0.25)"
              }
              maskColor={
                resolvedTheme === "light"
                  ? "rgba(0, 0, 0, 0.05)"
                  : "rgba(255, 255, 255, 0.05)"
              }
              zoomable
              pannable
            />
            <Controls
              fitViewOptions={{ padding: 0.8 }}
              className="!bottom-1 !shadow-control"
            />
            {menu && (
              <ContextMenu
                onClick={onPaneClick}
                duplicateNode={duplicateNode}
                setNodeModalOpen={setNodeModalOpen}
                {...menu}
              />
            )}
          </ReactFlow>

          <BlockExpandMenu
            selectedNode={selectedNode}
            modalIsOpen={nodeModalOpen}
            setModalOpen={setNodeModalOpen}
            nodeResults={programResults}
            pythonString={pythonString}
            blockFilePath={nodeFilePath}
          />
        </div>
      </ReactFlowProvider>
      <CommandMenu
        manifestRoot={manifest as TreeNode}
        open={isCommandMenuOpen}
        placeholder="Search for a node..."
        setOpen={setCommandMenuOpen}
        onItemSelect={onCommandMenuItemSelect}
      />
    </>
  );
};

export default FlowChartTab;
