import { useBlockStatus } from "@/renderer/hooks/useBlockStatus";
import { VisualizationProps } from "@/renderer/types/control";
import { Display } from "react-7-segment-display";

export const SevenSegmentDisplayNode = ({ data }: VisualizationProps) => {
  const { blockResult } = useBlockStatus(data.blockId);

  const value = blockResult?.data?.c ?? 0;

  const numDigits = Math.round(value).toString().length;

  return (
    <div>
      <Display
        value={value}
        count={numDigits}
        color="red"
        height={250}
        skew={false}
      />
    </div>
  );
};
