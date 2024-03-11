import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { WidgetProps } from "@/renderer/types/control";
import { toast } from "sonner";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Switch } from "@/renderer/components/ui/switch";

export const SwitchNode = ({ data }: WidgetProps) => {
  const { block, updateBlockParameter } = useControlBlock(data.blockId);
  if (!block) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const name = block.data.label;
  const paramVal = block.data.ctrls[data.blockParameter].value;

  const handleChange = (state: CheckedState) => {
    const res = updateBlockParameter(
      block.id,
      data.blockParameter,
      Boolean(state.valueOf()),
    );
    if (res.isErr()) {
      toast.error("Error updating block parameter", {
        description: res.error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center rounded-md border p-2">
      <div className="mb-2 text-muted-foreground">
        {name} ({data.blockParameter})
      </div>
      <Switch
        className="nodrag"
        checked={paramVal as boolean}
        onCheckedChange={handleChange}
      />
    </div>
  );
};
