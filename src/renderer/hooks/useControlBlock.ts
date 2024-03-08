import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";

export const useControlBlock = (blockId: string) => {
  const { block, updateBlockParameter } = useProjectStore(
    useShallow((state) => ({
      block: state.nodes.find((node) => node.id === blockId),
      updateBlockParameter: state.updateBlockParameter,
    })),
  );

  return {
    block,
    updateBlockParameter,
  };
};
