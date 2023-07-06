import { centerPositionAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import { useOnViewportChange, useReactFlow, Viewport } from "reactflow";

export const CenterObserver = () => {
  const [, setCenter] = useAtom(centerPositionAtom);
  const rfInstance = useReactFlow();

  useOnViewportChange({
    onEnd: (viewport: Viewport) => {
      const flowChart = document.getElementById("flow-chart");
      if (!flowChart) {
        throw new Error("flow-chart not found when trying to get the center");
      }
      const rect = flowChart.getBoundingClientRect();
      const projected = rfInstance.project({ x: rect.x / 2, y: rect.y / 2 });
      const offset = {
        x: 450 * (2 - viewport.zoom),
        y: 150 * (2 - viewport.zoom),
      };
      const newCenter = {
        x: projected.x + offset.x,
        y: projected.y + offset.y,
      };
      setCenter(newCenter);
    },
  });

  return <div />;
};
