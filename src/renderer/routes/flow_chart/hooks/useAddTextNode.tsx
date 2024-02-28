import { useCallback } from "react";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/renderer/stores/app";

export const useAddTextNode = () => {
  const addTextNode = useProjectStore(useShallow((state) => state.addTextNode));
  const center = useAppStore(useShallow((state) => state.centerPosition));

  return useCallback(() => {
    const pos = center ?? { x: 0, y: 0 };
    addTextNode(pos);
    sendEventToMix("Text Node Added");
  }, [addTextNode, center]);
};
