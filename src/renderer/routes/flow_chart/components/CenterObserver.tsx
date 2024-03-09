import { useOnViewportChange, useStoreApi } from "reactflow";
import { useShallow } from "zustand/react/shallow";
import { useFlowchartStore } from "@/renderer/stores/flowchart";

export const CenterObserver = () => {
  const setCenter = useFlowchartStore(
    useShallow((state) => state.setCenterPosition),
  );
  const store = useStoreApi();

  useOnViewportChange({
    onChange: () => {
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
