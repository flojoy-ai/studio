import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";
import { WidgetData } from "@/renderer/types/control";
import { toast } from "sonner";

export const useControl = (data: WidgetData) => {
  const { block, updateBlockParameter } = useProjectStore(
    useShallow((state) => ({
      block: state.nodes.find((node) => node.id === data.blockId),
      updateBlockParameter: state.updateBlockParameter,
    })),
  );

  if (!block) {
    return undefined;
  }

  const onValueChange = (val: string | number | boolean | null | undefined) => {
    const res = updateBlockParameter(block.id, data.blockParameter, val);
    if (res.isErr()) {
      toast.error("Error updating block parameter", {
        description: res.error.message,
      });
    }
  };

  return {
    block,
    name: block.data.label,
    value: block.data.ctrls[data.blockParameter].value,
    onValueChange,
  };
};
