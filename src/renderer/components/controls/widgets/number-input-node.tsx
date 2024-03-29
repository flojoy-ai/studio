import { WidgetProps } from "@/renderer/types/control";
import { NumberInput } from "@/renderer/components/common/NumberInput";
import { WidgetLabel } from "@/renderer/components/common/control-label";
import { useControl } from "@/renderer/hooks/useControl";

export const NumberInputNode = ({ id, data }: WidgetProps) => {
  const control = useControl(data);
  if (!control) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }
  const { name, value, onValueChange } = control;

  return (
    <div className="flex flex-col items-center gap-2">
      <WidgetLabel
        label={data.label}
        placeholder={`${name} (${data.blockParameter})`}
        id={id}
      />
      <NumberInput
        value={value as number}
        onChange={(val) => onValueChange(val === "" ? undefined : val)}
        className="nodrag text-xl font-bold"
        hideArrows
      />
    </div>
  );
};
