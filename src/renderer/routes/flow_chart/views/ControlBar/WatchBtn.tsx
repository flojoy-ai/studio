import { useEffect, useState } from "react";
import { Node, Edge } from "reactflow";
import { BlockData } from "@/renderer/types";
import { useFlowChartGraph } from "@/renderer/hooks/useFlowChartGraph";
import { Label } from "@/renderer/components/ui/label";
import { Switch } from "@/renderer/components/ui/switch";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/renderer/components/ui/tooltip";
import { toast } from "sonner";
import { useFlowchartStore } from "@/renderer/stores/flowchart";

interface WatchBtnProps {
  playFC: (nodes: Node<BlockData>[], edges: Edge[]) => void;
  cancelFC: () => void;
}

const WatchBtn = ({ playFC, cancelFC }: WatchBtnProps) => {
  const nodeParamChanged = useFlowchartStore((state) => state.nodeParamChanged);
  const { nodes, edges } = useFlowChartGraph();
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (isWatching && nodeParamChanged) {
      cancelFC();
      playFC(nodes, edges);
    }
  }, [nodeParamChanged, isWatching]);

  const handleClick = () => {
    if (!isWatching) {
      toast.message(
        "In watch mode, the flowchart will automatically re-run when any param changes.",
      );
    }
    setIsWatching(!isWatching);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isWatching}
        onCheckedChange={handleClick}
        data-testid="watch-mode-toggle"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>Watch Mode</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              The flowchart will automatically run every time you change a node
              parameter
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WatchBtn;
