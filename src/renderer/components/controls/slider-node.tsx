import { Input } from "@/renderer/components/ui/input";
import { SliderConfig, WidgetProps } from "@/renderer/types/control";
import WidgetLabel from "@/renderer/components/common/widget-label";
import { useControl } from "@/renderer/hooks/useControl";

export const SliderNode = ({ id, data }: WidgetProps<SliderConfig>) => {
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
        widgetId={id}
      />
      <div className="flex flex-col items-center rounded-md border p-2">
        <Input
          type="range"
          className="nodrag w-48 accent-accent2"
          min={data.config.min}
          max={data.config.max}
          step={data.config.step}
          value={value as number}
          onChange={(e) => onValueChange(parseInt(e.target.value, 10))}
        />
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};
