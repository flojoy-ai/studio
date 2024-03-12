import { WidgetProps } from "@/renderer/types/control";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import WidgetLabel from "@/renderer/components/common/widget-label";
import { useControl } from "@/renderer/hooks/useControl";

export const CheckboxNode = ({ id, data }: WidgetProps) => {
  const control = useControl(data);
  if (!control) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const { name, value, onValueChange } = control;

  return (
    <div className="flex flex-col items-center rounded-md">
      <WidgetLabel
        label={data.label}
        placeholder={`${name} (${data.blockParameter})`}
        widgetId={id}
      />
      <div className="py-1" />
      <Checkbox
        className="nodrag h-6 w-6"
        checked={value as boolean}
        onCheckedChange={(state) => onValueChange(Boolean(state.valueOf()))}
      />
    </div>
  );
};
