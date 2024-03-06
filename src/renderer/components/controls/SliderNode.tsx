import { Input } from "@/renderer/components/ui/input";
import { useProjectStore } from "@/renderer/stores/project";
import { WidgetProps } from "@/renderer/types/control";
import { ChangeEvent } from "react";
import { toast } from "sonner";

export const SliderNode = ({ data }: WidgetProps) => {
  const { blocks, updateBlockParameter } = useProjectStore((state) => ({
    blocks: state.nodes,
    updateBlockParameter: state.updateBlockParameter,
  }));

  const block = blocks.find((b) => b.id === data.blockId);
  if (!block) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const name = block.data.label;
  const paramVal = block.data.ctrls[data.blockParameter].value;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const res = updateBlockParameter(
      block.id,
      data.blockParameter,
      parseInt(e.target.value, 10),
    );
    if (res.isErr()) {
      toast.error("Error updating block parameter", {
        description: res.error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center rounded-md border p-2">
      <div className="text-muted-foreground">
        {name} ({data.blockParameter})
      </div>
      <Input
        type="range"
        className="nodrag"
        min="1"
        max="100"
        value={paramVal as number}
        onChange={handleChange}
      />
      <div className="text-xl font-bold">{paramVal}</div>
    </div>
  );
};
