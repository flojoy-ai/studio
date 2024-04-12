import { BlockDefinition, TreeNode } from "@/renderer/types/manifest";
import { useCallback, useEffect, useState } from "react";
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
  applyEdgeChanges,
  applyNodeChanges,
  OnConnect,
  NodeMouseHandler,
  BackgroundVariant,
  Background,
} from "reactflow";
import Sidebar from "@/renderer/routes/common/Sidebar/Sidebar";
import FlowChartKeyboardShortcuts from "./FlowChartKeyboardShortcuts";
import { BlockExpandMenu } from "./views/BlockExpandMenu";
import {
  ACTIONS_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { CenterObserver } from "./components/CenterObserver";
import { Separator } from "@/renderer/components/ui/separator";
import { Joystick, Pencil, Text, Workflow, X } from "lucide-react";
import { GalleryModal } from "@/renderer/components/gallery/GalleryModal";
import { useTheme } from "@/renderer/providers/theme-provider";
import { ClearCanvasBtn } from "./components/ClearCanvasBtn";
import { Button } from "@/renderer/components/ui/button";
import { ResizeFitter } from "./components/ResizeFitter";
import BlockEditModal from "./components/edit-menu/BlockEditModal";
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
import BlockContextMenu, {
  BlockContextMenuInfo,
} from "./components/block-context-menu";
import { Spinner } from "@/renderer/components/ui/spinner";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import nodeTypesMap from "@/renderer/components/blocks/block-types";
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
import CustomEdge from "./components/custom-edge";
import { useSocketStore } from "@/renderer/stores/socket";
import { calculateContextMenuOffset } from "@/renderer/utils/context-menu";
import { useContextMenu } from "@/renderer/hooks/useContextMenu";
import { Link } from "react-router-dom";
import FlowControlButtons from "./views/ControlBar/FlowControlButtons";
import { Input } from "@/renderer/components/ui/input";

const edgeTypes = {
  default: CustomEdge,
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

  const wipeBlockResults = useSocketStore((state) => state.wipeBlockResults);

  const [pythonString, setPythonString] = useState("...");
  const [nodeFilePath, setNodeFilePath] = useState("...");
  const [blockFullPath, setBlockFullPath] = useState("");

  const { nodes, edges, textNodes, handleNodeChanges, handleEdgeChanges } =
    useProjectStore(
      useShallow((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        textNodes: state.textNodes,
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
      handleNodeChanges(
        (ns) => applyNodeChanges(changes, ns),
        (ns) => applyNodeChanges(changes, ns),
      );
    },
    [handleNodeChanges],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      // sendEventToMix(MixPanelEvents.edgesChanged);
      handleEdgeChanges((es) => applyEdgeChanges(changes, es));
    },
    [handleEdgeChanges],
  );

  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      nodes.forEach((node) => {
        deleteBlock(node.id);
      });
    },
    [deleteBlock],
  );

  const clearCanvas = useCallback(() => {
    clearProjectCanvas();
    wipeBlockResults();

    // sendEventToMix(MixPanelEvents.canvasCleared);
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

  const onCommandMenuItemSelect = useCallback(
    (node: BlockDefinition) => {
      addBlock(node);
      setCommandMenuOpen(false);
    },
    [addBlock, setCommandMenuOpen],
  );

  const { menu, setMenu, flowRef, onPaneClick } =
    useContextMenu<BlockContextMenuInfo>();

  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node: Node<BlockData>) => {
      // Prevent native context menu from showing
      event.preventDefault();

      if (flowRef.current === null || !metadata) {
        return;
      }

      const nodeFileName = `${node.data.func}.py`;
      const nodeFileData = metadata[nodeFileName] ?? {};

      const offset = calculateContextMenuOffset(
        event.clientX,
        event.clientY,
        flowRef.current,
      );

      setMenu({
        node,
        ...offset,
        fullPath: nodeFileData.full_path ?? "",
      });
    },
    [flowRef, metadata, setMenu],
  );

  const addBlockReady = manifest !== undefined;

  const { setProjectName, projectName, hasUnsavedChanges } = useProjectStore(
    useShallow((state) => ({
      setProjectName: state.setProjectName,
      projectName: state.name,
      hasUnsavedChanges: state.hasUnsavedChanges,
    })),
  );

  return (
    <>
      <ReactFlowProvider>
        <div
          style={{
            height: ACTIONS_HEIGHT,
            position: "absolute",
            top: `calc(${LAYOUT_TOP_HEIGHT + ACTIONS_HEIGHT}px + 30px)`,
            right: "50px",
            zIndex: 10,
          }}
        >
          <FlowControlButtons />
        </div>
        <div
          style={{
            height: ACTIONS_HEIGHT,
            position: "absolute",
            top: `calc(${LAYOUT_TOP_HEIGHT + ACTIONS_HEIGHT}px + 20px)`,
            left: "12px",
            zIndex: 10,
          }}
        >
          <div className="felx inline-flex items-center gap-2 px-4 pt-1">
            <Input
              className={
                "h-6 w-28 overflow-hidden overflow-ellipsis whitespace-nowrap border-muted/60 text-sm focus:border-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 sm:w-48"
              }
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Untitled project"
            />
            {hasUnsavedChanges && (
              <div className=" h-2 w-2 rounded-full bg-foreground/50" />
            )}
          </div>
        </div>
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
            <ClearCanvasBtn clearCanvas={clearCanvas} />
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
            <div className="grow" />

            <Link to="/control" data-cy="control-btn">
              <Button
                data-testid="add-text-button"
                className="w-40 gap-2"
                variant="ghost"
              >
                <Joystick size={20} className="stroke-muted-foreground" />
                Control View
              </Button>
            </Link>
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
            <BlockEditModal
              node={selectedNode}
              otherNodes={otherNodes}
              setNodeModalOpen={setNodeModalOpen}
            />
          )}

          <FlowChartKeyboardShortcuts />
          <ResizeFitter />
          <CenterObserver />

          <ReactFlow
            id="flow-chart"
            ref={flowRef}
            className="!absolute"
            deleteKeyCode={isAdmin() ? deleteKeyCodes : null}
            proOptions={{ hideAttribution: true }}
            nodes={[...nodes, ...textNodes]}
            nodeTypes={nodeTypesMap}
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
            <Background color="#a6a6a6" variant={BackgroundVariant.Dots} />
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
              className="!bottom-1 !shadow-control ml-20"
            />
            {menu && (
              <BlockContextMenu
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
