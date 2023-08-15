import { useEffect } from "react";
import { useReactFlow, useStore } from "reactflow";

export const ResizeFitter = () => {
  const rfInstance = useReactFlow();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);

  useEffect(() => {
    rfInstance.fitView();
  }, [width, height, rfInstance]);

  return <div />;
};
