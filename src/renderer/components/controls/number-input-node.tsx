import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { WidgetProps } from "@/renderer/types/control";
import { toast } from "sonner";
import { NumberInput } from "@/renderer/components/common/NumberInput";

export const NumberInputNode = ({ data }: WidgetProps) => {
  const { block, updateBlockParameter } = useControlBlock(data.blockId);
  if (!block) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const name = block.data.label;
  const paramVal = block.data.ctrls[data.blockParameter].value;

  const handleChange = (val: number | "") => {
    const res = updateBlockParameter(
      block.id,
      data.blockParameter,
      val === "" ? undefined : val,
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
      <NumberInput
        value={paramVal as number}
        onChange={handleChange}
        className="nodrag text-xl font-bold"
        hideArrows
      />
    </div>
  );
};
