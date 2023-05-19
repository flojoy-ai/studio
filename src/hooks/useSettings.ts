import { useState } from "react";

export const useSettings = () => {
  const [nodeDelay, setNodeDelay] = useState(0);
  const [maximumRuntime, setMaximumRuntime] = useState(3000);
  return {
    nodeDelay,
    setNodeDelay,
    maximumRuntime,
    setMaximumRuntime,
  };
};
