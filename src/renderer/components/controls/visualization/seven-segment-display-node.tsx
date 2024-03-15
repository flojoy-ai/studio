import { useBlockStatus } from "@/renderer/hooks/useBlockStatus";
import { VisualizationProps } from "@/renderer/types/control";
import { Display } from "react-7-segment-display";
import { VisualizationLabel } from "@/renderer/components/common/control-label";
import { useProjectStore } from "@/renderer/stores/project";

export const SevenSegmentDisplayNode = ({ id, data }: VisualizationProps) => {
  const { blockResult } = useBlockStatus(data.blockId);

  const block = useProjectStore((state) =>
    state.nodes.find((node) => node.id === data.blockId),
  );
  if (!block) {
    throw new Error("Block not found, this shouldn't happen");
  }
  const value = blockResult?.data?.c ?? 0;

  const numDigits = Math.round(value).toString().length;

  const placeholder =
    `${block?.data.label}` +
    (data.blockOutput !== "default" ? ` (${data.blockOutput})` : "");

  return (
    <div className="flex flex-col items-center">
      <VisualizationLabel
        id={id}
        placeholder={placeholder}
        label={data.label}
      />
      <Display
        value={value}
        count={numDigits}
        color="red"
        height={100}
        skew={false}
      />
    </div>
  );
};
