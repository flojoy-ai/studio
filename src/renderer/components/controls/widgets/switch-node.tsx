import { WidgetProps } from "@/renderer/types/control";
import { Switch } from "@/renderer/components/ui/switch";
import { WidgetLabel } from "@/renderer/components/common/control-label";
import { useControl } from "@/renderer/hooks/useControl";

export const SwitchNode = ({ id, data }: WidgetProps) => {
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
        id={id}
      />
      <div className="py-1" />
      <Switch
        className="nodrag"
        checked={value as boolean}
        onCheckedChange={(state) => onValueChange(Boolean(state.valueOf()))}
      />
    </div>
  );
};
