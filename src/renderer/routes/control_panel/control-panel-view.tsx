import {
  ACTIONS_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "@/renderer/routes/common/Layout";
import ReactFlow, {
  Controls,
  OnNodesChange,
  OnNodesDelete,
  ReactFlowProvider,
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
import { WidgetConfig, WidgetBlockInfo } from "@/renderer/types/control";
import { ConfigDialog } from "./components/config-dialog";
import { useShallow } from "zustand/react/shallow";

const nodeTypes = {
  slider: SliderNode,
  visualization: VisualizationNode,
  TextNode: ControlTextNode,
};

const ControlPanelView = () => {
  const [newWidgetModalOpen, setNewWidgetModalOpen] = useState(false);
  const [newVisualizationModalOpen, setNewVisualizationModalOpen] =
    useState(false);

  const [widgetConfigOpen, setWidgetConfigOpen] = useState(false);
  const widgetBlockInfo = useRef<WidgetBlockInfo | null>(null);
  const widgetConfig = useRef<WidgetConfig>({
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
  });

  const { isAdmin } = useWithPermission();
  const {
    widgetNodes,
    visualizationNodes,
    textNodes,
    addTextNode,
    addControl,
    deleteNode,
    handleControlChanges,
  } = useProjectStore(
    useShallow((state) => ({
      widgetNodes: state.controlWidgetNodes,
      visualizationNodes: state.controlVisualizationNodes,
      textNodes: state.controlTextNodes,
      addTextNode: state.addControlTextNode,
      addControl: state.addControlWidget,
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

  const onWidgetBlockInfoSubmit = (data: WidgetBlockInfo) => {
    setNewWidgetModalOpen(false);
    setWidgetConfigOpen(true);
    widgetBlockInfo.current = data;
  };

  const onWidgetConfigSubmit = (data: WidgetConfig) => {
    if (!widgetBlockInfo.current) {
      return; // TODO: Error handling
    }
    const { blockId, blockParameter } = widgetBlockInfo.current;
    addControl(blockId, blockParameter, data);
    setWidgetConfigOpen(false);
  };

  return (
    <ReactFlowProvider>
      <ConfigDialog
        widgetType={widgetConfig.current.type}
        initialValues={widgetConfig.current}
        open={widgetConfigOpen}
        setOpen={setWidgetConfigOpen}
        onSubmit={onWidgetConfigSubmit}
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
        >
          <Controls
            fitViewOptions={{ padding: 0.8 }}
            className="!bottom-1 !shadow-control"
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default ControlPanelView;
