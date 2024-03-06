import { Input } from "@/renderer/components/ui/input";
import { useProjectStore } from "@/renderer/stores/project";
import { ControlProps } from "@/renderer/types/control";

export const SliderNode = ({ data }: ControlProps) => {
  const blocks = useProjectStore((state) => state.nodes);

  const block = blocks.find((b) => b.id === data.blockId);
  const name = block?.data.label;
  const paramVal = block?.data.ctrls[data.blockParameter].value;

  return (
    <div className="rounded-md border p-4">
      <div>
        {name} ({data.blockParameter})
      </div>
      <Input type="range" min="1" max="100" value={paramVal as number} />
      <div>{paramVal}</div>
    </div>
  );
};
