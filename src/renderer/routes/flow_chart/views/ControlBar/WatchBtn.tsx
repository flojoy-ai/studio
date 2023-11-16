import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useEffect, useState } from "react";
import { Node, Edge } from "reactflow";
import { ElementsData } from "@src/types";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Label } from "@src/components/ui/label";
import { Switch } from "@src/components/ui/switch";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@src/components/ui/tooltip";
import { toast } from "sonner";

interface WatchBtnProps {
  playFC: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
  cancelFC: () => void;
}

const WatchBtn = ({ playFC, cancelFC }: WatchBtnProps) => {
  const { nodeParamChanged } = useFlowChartState();
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
