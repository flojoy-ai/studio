import { WidgetProps } from "@/renderer/types/control";
import { Label } from "@/renderer/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/renderer/components/ui/radio-group";
import { useControl } from "@/renderer/hooks/useControl";

export const RadioGroupNode = ({ data }: WidgetProps) => {
  const control = useControl(data);
  if (!control) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }
  const { block, name, value, onValueChange } = control;

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
        value={value?.toString() ?? undefined}
        onValueChange={onValueChange}
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
