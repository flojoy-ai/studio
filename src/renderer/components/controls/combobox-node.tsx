import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { WidgetProps } from "@/renderer/types/control";
import { ChangeEvent } from "react";
import { toast } from "sonner";

export const ComboboxNode = ({ data }: WidgetProps) => {
  const { block, updateBlockParameter } = useControlBlock(data.blockId);
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
      {/* <Input */}
      {/*   type="range" */}
      {/*   className="nodrag" */}
      {/*   min={data.config.min} */}
      {/*   max={data.config.max} */}
      {/*   step={data.config.step} */}
      {/*   value={paramVal as number} */}
      {/*   onChange={handleChange} */}
      {/* /> */}
      <div className="text-xl font-bold">{paramVal}</div>
    </div>
  );
};
