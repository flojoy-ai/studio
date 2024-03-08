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
} from "reactflow";
import { SliderNode } from "@/renderer/components/controls/slider-node";
import ControlTextNode from "@/renderer/components/controls/control-text-node";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import {
  useClearControlPanel,
  useProjectStore,
} from "@/renderer/stores/project";
import { Button } from "@/renderer/components/ui/button";
import { ClearCanvasBtn } from "@/renderer/routes/flow_chart/components/ClearCanvasBtn";
import { Text } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { NewWidgetModal } from "./components/new-widget-modal";
import VisualizationNode from "@/renderer/components/controls/visualization-node";
import { NewVisualizationModal } from "./components/new-visualization";
import {
  WidgetConfig,
  WidgetBlockInfo,
  CONFIGURABLE,
  Configurable,
  WidgetType,
  WidgetData,
  VisualizationData,
  isWidgetType,
} from "@/renderer/types/control";
import { ConfigDialog } from "./components/config-dialog";
import { useShallow } from "zustand/react/shallow";
import { CheckboxNode } from "@/renderer/components/controls/checkbox-node";
import WidgetContextMenu, {
  WidgetContextMenuInfo,
} from "./components/widget-context-menu";
import { TextData } from "@/renderer/types/block";
import { calculateContextMenuOffset } from "@/renderer/utils/context-menu";
import { toast } from "sonner";
import { useContextMenu } from "@/renderer/hooks/useContextMenu";

const nodeTypes = {
  slider: SliderNode,
  checkbox: CheckboxNode,
  visualization: VisualizationNode,
  TextNode: ControlTextNode,
};

const CONFIG_DEFAULT_VALUES = {
  slider: {
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Record<Configurable, WidgetConfig>;

const isConfigurable = (widgetType: WidgetType): widgetType is Configurable => {
  return CONFIGURABLE.includes(widgetType);
};

const ControlPanelView = () => {
  const [newWidgetModalOpen, setNewWidgetModalOpen] = useState(false);
  const [newVisualizationModalOpen, setNewVisualizationModalOpen] =
    useState(false);

  const [widgetConfigOpen, setWidgetConfigOpen] = useState(false);
  const widgetBlockInfo = useRef<WidgetBlockInfo | null>(null);
  const editingWidgetConfig = useRef<boolean>(false);
  const widgetConfig = useRef<WidgetConfig>(CONFIG_DEFAULT_VALUES["slider"]);

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

    widgetConfig.current = CONFIG_DEFAULT_VALUES[data.widgetType];
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
    editConfig(widgetBlockInfo.current.blockId, data);
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

  return (
    <ReactFlowProvider>
      <ConfigDialog
        widgetType={widgetConfig.current.type}
        initialValues={widgetConfig.current}
        open={widgetConfigOpen}
        setOpen={setWidgetConfigOpen}
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

          <div className="grow" />
          <ClearCanvasBtn clearCanvas={clearCanvas} />
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
