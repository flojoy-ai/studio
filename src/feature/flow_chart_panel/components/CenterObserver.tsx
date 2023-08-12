import { centerPositionAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import { useOnViewportChange, useStoreApi } from "reactflow";

export const CenterObserver = () => {
  const [, setCenter] = useAtom(centerPositionAtom);
  const store = useStoreApi();

  useOnViewportChange({
    onEnd: () => {
      const {
        height,
        width,
        transform: [transformX, transformY, zoomLevel],
      } = store.getState();
      const zoomMultiplier = 1 / zoomLevel;

      // Figure out the center of the current viewport
      const centerX =
        -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
      const centerY =
        -transformY * zoomMultiplier + (height * zoomMultiplier) / 2;

      const newCenter = {
        x: centerX,
        y: centerY,
      };

      setCenter(newCenter);
    },
  });

  return <div />;
};
