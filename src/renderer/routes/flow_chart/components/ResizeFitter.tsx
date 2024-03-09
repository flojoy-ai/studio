import { useSettingsStore } from "@/renderer/stores/settings";
import { useEffect } from "react";
import { useReactFlow, useStore } from "reactflow";

export const ResizeFitter = () => {
  const { fitViewOnResize } = useSettingsStore((state) => state.frontend);
  const rfInstance = useReactFlow();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);

  const shouldResize = fitViewOnResize.value;

  useEffect(() => {
    if (shouldResize) {
      rfInstance.fitView({
        padding: 0.8,
        duration: 1,
      });
    }
  }, [width, height, rfInstance, shouldResize]);

  return <div />;
};
