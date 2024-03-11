import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { WidgetProps } from "@/renderer/types/control";
import { toast } from "sonner";
import { Label } from "@/renderer/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/renderer/components/ui/radio-group";

export const RadioGroupNode = ({ data }: WidgetProps) => {
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

  const options =
    block.data.ctrls[data.blockParameter].options?.map(
      (v) => v.toString() ?? "",
    ) ?? [];

  return (
    <div className="flex flex-col items-center rounded-md border p-2">
      <div className="text-muted-foreground">
        {name} ({data.blockParameter})
      </div>
      <div className="py-2"></div>
      <RadioGroup
        value={paramVal?.toString() ?? undefined}
        onValueChange={handleChange}
      >
        {options.map((option) => (
          <div className="flex items-center space-x-2" key={option}>
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      <div className="py-2"></div>
    </div>
  );
};
