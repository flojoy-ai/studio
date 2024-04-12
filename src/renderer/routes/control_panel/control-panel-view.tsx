import {
  ACTIONS_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "@/renderer/routes/common/Layout";
import ReactFlow, {
  Controls,
  NodeMouseHandler,
  OnNodesChange,
  OnNodesDelete,
  ReactFlowProvider,
  Node,
  applyNodeChanges,
  Background,
  BackgroundVariant,
} from "reactflow";
import ControlTextNode from "@/renderer/components/controls/control-text-node";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import {
  useClearControlPanel,
  useProjectStore,
} from "@/renderer/stores/project";
import { Button } from "@/renderer/components/ui/button";
import { ClearCanvasBtn } from "@/renderer/routes/flow_chart/components/ClearCanvasBtn";
import { Binary, Text } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { NewWidgetModal } from "./components/new-widget-modal";
import { NewVisualizationModal } from "./components/new-visualization";
import {
  WidgetConfig,
  WidgetBlockInfo,
  WidgetData,
  VisualizationData,
  isWidgetType,
  isConfigurable,
  WIDGETS,
  WIDGET_CONFIGS,
  VISUALIZATIONS,
} from "@/renderer/types/control";
import { ConfigDialog } from "./components/config-dialog";
import { useShallow } from "zustand/react/shallow";
import WidgetContextMenu, {
  WidgetContextMenuInfo,
} from "./components/widget-context-menu";
import { TextData } from "@/renderer/types/block";
import { calculateContextMenuOffset } from "@/renderer/utils/context-menu";
import { toast } from "sonner";
import { useContextMenu } from "@/renderer/hooks/useContextMenu";
import { deepMutableClone } from "@/renderer/utils/clone";
import { Link } from "react-router-dom";
import FlowControlButtons from "../flow_chart/views/ControlBar/FlowControlButtons";
import _ from "lodash";
import { Input } from "@/renderer/components/ui/input";

const nodeTypes = {
  TextNode: ControlTextNode,
  ..._.mapValues(VISUALIZATIONS, (v) => v.node),
  ..._.mapValues(WIDGETS, (v) => v.node),
};

const ControlPanelView = () => {
  const [newWidgetModalOpen, setNewWidgetModalOpen] = useState(false);
  const [newVisualizationModalOpen, setNewVisualizationModalOpen] =
    useState(false);

  const [widgetConfigOpen, setWidgetConfigOpen] = useState(false);
  const widgetBlockInfo = useRef<WidgetBlockInfo | null>(null);
  const editingWidgetConfig = useRef<boolean>(false);
  const widgetConfig = useRef<WidgetConfig>(
    deepMutableClone(WIDGET_CONFIGS.slider.defaultValues),
  );

  const { isAdmin } = useWithPermission();
  const {
    widgetNodes,
    visualizationNodes,
    textNodes,
    addTextNode,
    addControl,
    editConfig,
    deleteNode,
    handleControlChanges,
  } = useProjectStore(
    useShallow((state) => ({
      widgetNodes: state.controlWidgetNodes,
      visualizationNodes: state.controlVisualizationNodes,
      textNodes: state.controlTextNodes,
      addTextNode: state.addControlTextNode,
      addControl: state.addControlWidget,
      editConfig: state.editControlWidgetConfig,
      addNode: state.addControlWidget,
      deleteNode: state.deleteControlWidget,
      handleControlChanges: state.handleControlChanges,
    })),
  );

  const deleteKeyCodes = ["Delete", "Backspace"];

  const clearCanvas = useClearControlPanel();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      handleControlChanges(
        (ns) => applyNodeChanges(changes, ns),
        (ns) => applyNodeChanges(changes, ns),
        (ns) => applyNodeChanges(changes, ns),
      );
    },
    [handleControlChanges],
  );

  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      nodes.forEach((node) => {
        deleteNode(node.id);
      });
    },
    [deleteNode],
  );

  const { menu, setMenu, flowRef, onPaneClick } =
    useContextMenu<WidgetContextMenuInfo>();

  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node: Node<WidgetData | VisualizationData | TextData>) => {
      // Prevent native context menu from showing
      event.preventDefault();
      if (flowRef.current === null || !node.type || !isWidgetType(node.type))
        return;
      const widgetNode = node as Node<WidgetData>;

      const offset = calculateContextMenuOffset(
        event.clientX,
        event.clientY,
        flowRef.current,
      );

      setMenu({
        node: widgetNode,
        ...offset,
      });
    },
    [flowRef, setMenu],
  );

  const onWidgetBlockInfoSubmit = (data: WidgetBlockInfo) => {
    setNewWidgetModalOpen(false);
    if (!isConfigurable(data.widgetType)) {
      addControl(data.blockId, data.blockParameter, data.widgetType);
      return;
    }

    widgetConfig.current = deepMutableClone(
      WIDGET_CONFIGS[data.widgetType].defaultValues,
    );
    widgetBlockInfo.current = data;
    editingWidgetConfig.current = false;
    setWidgetConfigOpen(true);
  };

  const onWidgetConfigSubmit = (data: WidgetConfig) => {
    if (!widgetBlockInfo.current) {
      return; // TODO: Error handling
    }
    const { blockId, blockParameter } = widgetBlockInfo.current;
    addControl(blockId, blockParameter, data.type, data);
    setWidgetConfigOpen(false);
  };

  const onWidgetConfigEditSubmit = (data: WidgetConfig) => {
    if (!widgetBlockInfo.current) {
      return; // TODO: Error handling
    }
    const res = editConfig(widgetBlockInfo.current.blockId, data);
    if (res.isErr()) {
      toast.error(res.error.message);
      return;
    }
    setWidgetConfigOpen(false);
  };

  const menuNodeType = menu?.node.type;
  const selectingConfigurableNode =
    menuNodeType && isWidgetType(menuNodeType) && isConfigurable(menuNodeType);
  const openWidgetEdit = selectingConfigurableNode
    ? () => {
        const currentConfig = menu.node.data.config;
        if (currentConfig === undefined) {
          toast.error("No config data found for this widget");
          return;
        }

        editingWidgetConfig.current = true;
        widgetBlockInfo.current = {
          blockId: menu.node.data.blockId,
          blockParameter: menu.node.data.blockParameter,
          widgetType: menuNodeType,
        };
        widgetConfig.current = currentConfig;
        setWidgetConfigOpen(true);
      }
    : undefined;


  const { setProjectName, projectName, hasUnsavedChanges } = useProjectStore(
    useShallow((state) => ({
      setProjectName: state.setProjectName,
      projectName: state.name,
      hasUnsavedChanges: state.hasUnsavedChanges,
    })),
  );

  return (
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
      <ConfigDialog
        initialValues={widgetConfig.current}
        open={widgetConfigOpen}
        setOpen={setWidgetConfigOpen}
        widgetBlockInfo={widgetBlockInfo.current}
        onSubmit={
          editingWidgetConfig.current
            ? onWidgetConfigEditSubmit
            : onWidgetConfigSubmit
        }
      />
      <div className="mx-8 border-b" style={{ height: ACTIONS_HEIGHT }}>
        <div className="py-1" />
        <div className="flex">
          <NewWidgetModal
            open={newWidgetModalOpen}
            setOpen={setNewWidgetModalOpen}
            onSubmit={onWidgetBlockInfoSubmit}
          />
          <NewVisualizationModal
            open={newVisualizationModalOpen}
            setOpen={setNewVisualizationModalOpen}
          />
          <Button
            data-testid="add-text-button"
            className="gap-2"
            variant="ghost"
            onClick={() => addTextNode({ x: 0, y: 0 })}
          >
            <Text size={20} className="stroke-muted-foreground" />
            Add Text
          </Button>
          <ClearCanvasBtn clearCanvas={clearCanvas} />
          <div className="grow" />

          <Link to="/flowchart" data-cy="script-btn">
            <Button
              data-testid="add-text-button"
              className="w-40 gap-2"
              variant="ghost"
            >
              <Binary size={20} className="stroke-muted-foreground" />
              Editor View
            </Button>
          </Link>
        </div>
        <div className="py-1" />
      </div>
      <div
        style={{
          height: `calc(100vh - ${
            LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT
          }px)`,
        }}
        className="relative overflow-hidden bg-background"
        data-testid="react-flow"
      >
        <ReactFlow
          className="!absolute"
          ref={flowRef}
          deleteKeyCode={isAdmin() ? deleteKeyCodes : null}
          proOptions={{ hideAttribution: true }}
          nodes={[...textNodes, ...widgetNodes, ...visualizationNodes]}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          nodesDraggable={isAdmin()}
          onNodesDelete={handleNodesDelete}
          fitViewOptions={{
            padding: 0.8,
          }}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
        >
          <Background color="#a6a6a6" variant={BackgroundVariant.Dots} />
          <Controls
            fitViewOptions={{ padding: 0.8 }}
            className="!bottom-1 !shadow-control"
          />
          {menu && (
            <WidgetContextMenu
              onClick={onPaneClick}
              openWidgetEdit={openWidgetEdit}
              {...menu}
            />
          )}
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default ControlPanelView;
