import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { centerPositionAtom } from "@src/hooks/useFlowChartState";
import { addRandomPositionOffset } from "@src/utils/RandomPositionOffset";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export const useAddTextNode = () => {
  const { setTextNodes } = useFlowChartGraph();
  const center = useAtomValue(centerPositionAtom);

  return useCallback(() => {
    const pos = center ?? { x: 0, y: 0 };
    setTextNodes((prev) =>
      prev.concat({
        id: `TextNode-${uuidv4()}`,
        position: addRandomPositionOffset(pos, 30),
        type: "TextNode",
        data: {
          text: "Enter text here",
        },
      }),
    );
  }, [setTextNodes, center]);
};
