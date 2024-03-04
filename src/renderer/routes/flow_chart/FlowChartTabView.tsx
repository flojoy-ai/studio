import { useSocket } from "@/renderer/hooks/useSocket";
import { BlockDefinition, TreeNode } from "@/renderer/types/manifest";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionLineType,
  MiniMap,
  OnEdgesChange,
  OnInit,
  OnNodesChange,
  OnNodesDelete,
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Node,
  NodeTypes,
  applyEdgeChanges,
  applyNodeChanges,
  OnConnect,
} from "reactflow";
import Sidebar from "@/renderer/routes/common/Sidebar/Sidebar";
import FlowChartKeyboardShortcuts from "./FlowChartKeyboardShortcuts";
import { useFlowChartTabState } from "./FlowChartTabState";
import { BlockExpandMenu } from "./views/BlockExpandMenu";
import {
  MixPanelEvents,
  sendEventToMix,
} from "@/renderer/services/MixpanelServices";
import {
  ACTIONS_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { CenterObserver } from "./components/CenterObserver";
import { Separator } from "@/renderer/components/ui/separator";
import { Pencil, Text, Workflow, X } from "lucide-react";
import { GalleryModal } from "@/renderer/components/gallery/GalleryModal";
import { useTheme } from "@/renderer/providers/ThemeProvider";
import { ClearCanvasBtn } from "./components/ClearCanvasBtn";
import { Button } from "@/renderer/components/ui/button";
import { ResizeFitter } from "./components/ResizeFitter";
import NodeEditModal from "./components/node-edit-menu/NodeEditModal";
import { WelcomeModal } from "./views/WelcomeModal";
import { CommandMenu } from "@/renderer/routes/command/CommandMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/renderer/components/ui/tooltip";
import { BlockData } from "@/renderer/types/block";
import useKeyboardShortcut from "@/renderer/hooks/useKeyboardShortcut";
import ArithmeticBlock from "@/renderer/components/nodes/ArithmeticBlock";
import ConditionalBlock from "@/renderer/components/nodes/ConditionalBlock";
import DataBlock from "@/renderer/components/nodes/DataBlock";
import DefaultBlock from "@/renderer/components/nodes/DefaultBlock";
import IOBlock from "@/renderer/components/nodes/IOBlock";
import LogicBlock from "@/renderer/components/nodes/LogicBlock";
import NumpyBlock from "@/renderer/components/nodes/NumpyBlock";
import ScipyBlock from "@/renderer/components/nodes/ScipyBlock";
import VisorBlock from "@/renderer/components/nodes/VisorBlock";
import TextNode from "@/renderer/components/nodes/TextNode";
import ContextMenu, { MenuInfo } from "./components/NodeContextMenu";
import { Spinner } from "@/renderer/components/ui/spinner";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import {
  useAddBlock,
  useClearCanvas,
  useCreateEdge,
  useDeleteBlock,
  useDuplicateBlock,
  useAddTextNode,
  useGraphResync,
  useProjectStore,
} from "@/renderer/stores/project";
import { toast } from "sonner";
import _ from "lodash";
import { useShallow } from "zustand/react/shallow";
import {
  useManifest,
  useManifestStore,
  useMetadata,
} from "@/renderer/stores/manifest";

const nodeTypes: NodeTypes = {
  default: DefaultBlock,
  AI_ML: DataBlock,
  GENERATORS: DataBlock,
  VISUALIZERS: VisorBlock,
  EXTRACTORS: DefaultBlock,
  TRANSFORMERS: DefaultBlock,
  LOADERS: DefaultBlock,
  ARITHMETIC: ArithmeticBlock,
  IO: IOBlock,
  LOGIC_GATES: LogicBlock,
  CONDITIONALS: ConditionalBlock,
  SCIPY: ScipyBlock,
  NUMPY: NumpyBlock,
  DATA: DataBlock,
  VISUALIZATION: VisorBlock,
  ETL: DefaultBlock,
  DSP: DefaultBlock,
  CONTROL_FLOW: LogicBlock,
  MATH: DefaultBlock,
  HARDWARE: IOBlock,
  TextNode: TextNode,
};

const edgeTypes = {
  default: SmartBezierEdge,
};

const FlowChartTab = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);

  const { isEditMode, setIsEditMode } = useFlowchartStore(
    useShallow((state) => ({
      isEditMode: state.isEditMode,
      setIsEditMode: state.setIsEditMode,
    })),
  );

  const { resolvedTheme } = useTheme();

  const { blockResults, wipeBlockResults } = useSocket();

  const {
    pythonString,
    setPythonString,
    nodeFilePath,
    setNodeFilePath,
    blockFullPath,
    setBlockFullPath,
  } = useFlowChartTabState();

  const {
    nodes,
    edges,
    textNodes,
    handleTextNodeChanges,
    handleNodeChanges,
    handleEdgeChanges,
  } = useProjectStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      textNodes: state.textNodes,
      handleTextNodeChanges: state.handleTextNodeChanges,
      handleNodeChanges: state.handleNodeChanges,
      handleEdgeChanges: state.handleEdgeChanges,
    })),
  );

  const [selectedNodes, otherNodes] = _.partition(nodes, (n) => n.selected);
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null;

  const manifest = useManifest();
  const metadata = useMetadata();

  const { standardManifest, customManifest } = useManifestStore(
    useShallow((state) => ({
      standardManifest: state.standardBlocksManifest,
      customManifest: state.customBlocksManifest,
      importCustomBlocks: state.importCustomBlocks,
    })),
  );

  const { isAdmin } = useWithPermission();

  useGraphResync();

  const addBlock = useAddBlock();
  const createEdge = useCreateEdge();
  const addTextNode = useAddTextNode();
  const duplicateBlock = useDuplicateBlock();
  const deleteBlock = useDeleteBlock();
  const clearProjectCanvas = useClearCanvas();

  const duplicateSelectedNode = useCallback(() => {
    if (selectedNode) {
      const res = duplicateBlock(selectedNode);
      if (res.isErr()) {
        toast.error(res.error.message);
      }
    }
  }, [selectedNode, duplicateBlock]);

  useKeyboardShortcut("ctrl", "d", duplicateSelectedNode);
  useKeyboardShortcut("meta", "d", duplicateSelectedNode);

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [setIsSidebarOpen],
  );

  const onInit: OnInit = (rfIns) => {
    rfIns.fitView({
      padding: 0.8,
    });
  };

  const onConnect: OnConnect = useCallback(
    (conn) => {
      console.log(conn);
      const res = createEdge(conn);
      if (res.isErr()) {
        if (res.error instanceof TypeError) {
          toast.message("Type Error", { description: res.error.message });
        } else {
          toast.error(res.error.message);
        }
      }
    },
    [createEdge],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      handleNodeChanges((ns) => applyNodeChanges(changes, ns));
      handleTextNodeChanges((ns) => applyNodeChanges(changes, ns));
    },
    [handleNodeChanges, handleTextNodeChanges],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      sendEventToMix(MixPanelEvents.edgesChanged);
      handleEdgeChanges((es) => applyEdgeChanges(changes, es));
    },
    [handleEdgeChanges],
  );

  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      nodes.forEach((node) => {
        deleteBlock(node.id, node.data.label);
      });
    },
    [deleteBlock],
  );

  const clearCanvas = useCallback(() => {
    clearProjectCanvas();
    wipeBlockResults();

    sendEventToMix(MixPanelEvents.canvasCleared);
  }, [clearProjectCanvas, wipeBlockResults]);

  useEffect(() => {
    if (selectedNode === null || !metadata) {
      return;
    }
    const nodeFileName = `${selectedNode?.data.func}.py`;
    const nodeFileData = metadata[nodeFileName] ?? {};
    setNodeFilePath(nodeFileData.path ?? "");
    setPythonString(nodeFileData.metadata ?? "");
    setBlockFullPath(nodeFileData.full_path ?? "");
  }, [
    metadata,
    selectedNode,
    setNodeFilePath,
    setPythonString,
    setBlockFullPath,
  ]);

  const deleteKeyCodes = ["Delete", "Backspace"];

  const proOptions = { hideAttribution: true };

  const onCommandMenuItemSelect = (node: BlockDefinition) => {
    addBlock(node);
    setCommandMenuOpen(false);
  };

  const [menu, setMenu] = useState<MenuInfo | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const onNodeContextMenu = useCallback(
    (event, node: Node<BlockData>) => {
      // Prevent native context menu from showing
      event.preventDefault();

      if (ref.current === null || !metadata) {
        return;
      }

      const nodeFileName = `${node.data.func}.py`;
      const nodeFileData = metadata[nodeFileName] ?? {};

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      const topToBlock = event.clientY;
      const contextMenuHeight = 200;

      const paneToBlock = topToBlock - 200;

      let top: number | undefined = undefined;
      let bottom: number | undefined = undefined;

      if (paneToBlock < contextMenuHeight / 2) {
        top = paneToBlock;
      } else if (paneToBlock < contextMenuHeight) {
        if (pane.height - paneToBlock < contextMenuHeight) {
          top = contextMenuHeight - paneToBlock;
        } else {
          top = paneToBlock;
        }
      } else if (pane.height - paneToBlock < contextMenuHeight) {
        top = undefined;
        bottom = pane.height - paneToBlock;
      } else {
        top = paneToBlock;
      }
      setMenu({
        id: node.id,
        top,
        left: event.clientX < pane.width - 200 ? event.clientX : undefined,
        right:
          event.clientX >= pane.width - 200
            ? pane.width - event.clientX
            : undefined,
        bottom,
        fullPath: nodeFileData.full_path ?? "",
      });
    },
    [setMenu, metadata],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  const addBlockReady = manifest !== undefined;

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
                    disabled={!addBlockReady}
                  >
                    {addBlockReady ? (
                      <>
                        <Workflow
                          size={20}
                          className="stroke-muted-foreground"
                        />
                        Add Block
                      </>
                    ) : (
                      <>
                        <Spinner></Spinner>
                        Loading Blocks
                      </>
                    )}
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
                    Edit Block
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

        {standardManifest !== undefined && customManifest !== undefined && (
          <Sidebar
            sections={standardManifest}
            leafNodeClickHandler={addBlock}
            isSideBarOpen={isSidebarOpen}
            setSideBarStatus={setIsSidebarOpen}
            customSections={customManifest}
          />
        )}

        <WelcomeModal />

        <div
          style={{
            height: `calc(100vh - ${
              LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT
            }px)`,
          }}
          className="relative overflow-hidden bg-background"
          data-testid="react-flow"
          id="flow-chart-area"
        >
          {selectedNode && isEditMode && (
            <NodeEditModal
              node={selectedNode}
              otherNodes={otherNodes}
              setNodeModalOpen={setNodeModalOpen}
              handleDelete={deleteBlock}
            />
          )}

          <FlowChartKeyboardShortcuts />
          <ResizeFitter />
          <CenterObserver />

          <ReactFlow
            id="flow-chart"
            ref={ref}
            className="!absolute"
            deleteKeyCode={isAdmin() ? deleteKeyCodes : null}
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
            nodesDraggable={isAdmin()}
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
                duplicateBlock={duplicateBlock}
                setNodeModalOpen={setNodeModalOpen}
                {...menu}
              />
            )}
          </ReactFlow>

          <BlockExpandMenu
            selectedNode={selectedNode}
            modalIsOpen={nodeModalOpen}
            setModalOpen={setNodeModalOpen}
            blockResults={blockResults}
            pythonString={pythonString}
            blockFilePath={nodeFilePath}
            blockFullPath={blockFullPath}
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
