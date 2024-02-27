import { centerPositionAtom } from "@/renderer/hooks/useFlowChartState";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useProjectStore } from "@/renderer/stores/project";

export const useAddTextNode = () => {
  const addTextNode = useProjectStore((state) => state.addTextNode);
  const center = useAtomValue(centerPositionAtom);

  return useCallback(() => {
    const pos = center ?? { x: 0, y: 0 };
    addTextNode(pos);
    sendEventToMix("Text Node Added");
  }, [addTextNode, center]);
};
