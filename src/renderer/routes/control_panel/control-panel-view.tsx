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
import { SliderNode } from "@/renderer/components/controls/SliderNode";
import ControlTextNode from "@/renderer/components/controls/ControlTextNode";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useProjectStore } from "@/renderer/stores/project";
import { Button } from "@/renderer/components/ui/button";
import { ClearCanvasBtn } from "@/renderer/routes/flow_chart/components/ClearCanvasBtn";
import { Text } from "lucide-react";
import { useCallback, useState } from "react";
import { NewWidgetModal } from "./components/new-widget-modal";
import VisualizationNode from "@/renderer/components/controls/VisualizationNode";
import { NewVisualizationModal } from "./components/new-visualization";

const nodeTypes = {
  slider: SliderNode,
  visualization: VisualizationNode,
  TextNode: ControlTextNode,
};

const ControlPanelView = () => {
  const [newWidgetModalOpen, setNewWidgetModalOpen] = useState(false);
  const [newVisualizationModalOpen, setNewVisualizationModalOpen] =
    useState(false);

  const { isAdmin } = useWithPermission();
  const {
    widgetNodes,
    visualizationNodes,
    textNodes,
    addTextNode,
    deleteNode,
    handleControlChanges,
  } = useProjectStore((state) => ({
    widgetNodes: state.controlWidgetNodes,
    visualizationNodes: state.controlVisualizationNodes,
    textNodes: state.controlTextNodes,
    addTextNode: state.addControlTextNode,
    addNode: state.addControlWidget,
    deleteNode: state.deleteControlWidget,
    handleControlChanges: state.handleControlChanges,
  }));

  const deleteKeyCodes = ["Delete", "Backspace"];

  const clearCanvas = () => {
    throw new Error("Not implemented");
  };

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

  return (
    <ReactFlowProvider>
      <div className="mx-8 border-b" style={{ height: ACTIONS_HEIGHT }}>
        <div className="py-1" />
        <div className="flex">
          <NewWidgetModal
            open={newWidgetModalOpen}
            setOpen={setNewWidgetModalOpen}
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
        id="flow-chart-area"
      >
        <ReactFlow
          id="flow-chart"
          className="!absolute"
          deleteKeyCode={isAdmin() ? deleteKeyCodes : null}
          proOptions={{ hideAttribution: true }}
          nodes={[...widgetNodes, ...visualizationNodes, ...textNodes]}
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
