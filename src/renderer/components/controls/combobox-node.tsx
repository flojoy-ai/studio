import { WidgetProps } from "@/renderer/types/control";
import { Combobox } from "@/renderer/components/ui/combobox";
import { useControl } from "@/renderer/hooks/useControl";

export const ComboboxNode = ({ data }: WidgetProps) => {
  const control = useControl(data);
  if (!control) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const { block, name, value, onValueChange } = control;

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
        value={value?.toString() ?? ""}
        onValueChange={onValueChange}
        valueSelector={(v) => v}
        displaySelector={(v) => v}
      />
      {/* <div className="text-xl font-bold">{paramVal}</div> */}
    </div>
  );
};
