import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { WidgetProps } from "@/renderer/types/control";
import { toast } from "sonner";
import { Combobox } from "@/renderer/components/ui/combobox";

export const ComboboxNode = ({ data }: WidgetProps) => {
  const { block, updateBlockParameter } = useControlBlock(data.blockId);
  if (!block) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const name = block.data.label;
  const paramVal = block.data.ctrls[data.blockParameter].value;

  const handleChange = (val: string) => {
    const res = updateBlockParameter(block.id, data.blockParameter, val);
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
      <Combobox
        options={
          block.data.ctrls[data.blockParameter].options?.map(
            (v) => v.toString() ?? "",
          ) ?? []
        }
        value={paramVal?.toString() ?? ""}
        onValueChange={handleChange}
        valueSelector={(v) => v}
        displaySelector={(v) => v}
      />
      <div className="text-xl font-bold">{paramVal}</div>
    </div>
  );
};
