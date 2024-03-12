import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { WidgetProps } from "@/renderer/types/control";
import { toast } from "sonner";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Switch } from "@/renderer/components/ui/switch";
import WidgetLabel from "@/renderer/components/common/widget-label";

export const SwitchNode = ({ id, data }: WidgetProps) => {
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
    <div className="flex flex-col items-center rounded-md">
      <WidgetLabel
        label={data.label}
        placeholder={`${name} (${data.blockParameter})`}
        widgetId={id}
      />
      <div className="py-1" />
      <Switch
        className="nodrag"
        checked={paramVal as boolean}
        onCheckedChange={handleChange}
      />
    </div>
  );
};
