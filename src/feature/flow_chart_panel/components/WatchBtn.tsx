import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useEffect, useState } from "react";
import { Node, Edge } from "reactflow";
import { ElementsData } from "flojoy/types";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Label } from "@src/components/ui/label";
import { Switch } from "@src/components/ui/switch";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface WatchBtnProps {
  playFC: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
  cancelFC: () => void;
}

const WatchBtn = ({ playFC, cancelFC }: WatchBtnProps) => {
  const { nodeParamChanged } = useFlowChartState();
  const { nodes, edges } = useFlowChartGraph();
  const [isWatching, setIsWatching] = useState(false);
  const [runOnceRightAfterToggle, setRunOnceRightAfterToggle] = useState(false);

  useEffect(() => {
    if (isWatching && nodeParamChanged) {
      cancelFC();
      playFC(nodes, edges);
    }
  }, [nodeParamChanged, isWatching]);

  useEffect(() => {
    if (isWatching && runOnceRightAfterToggle) {
      cancelFC();
      playFC(nodes, edges);
      setRunOnceRightAfterToggle(false);
    }
  }, [runOnceRightAfterToggle, isWatching]);

  const handleClick = () => {
    setIsWatching(!isWatching);
    setRunOnceRightAfterToggle(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={isWatching} onCheckedChange={handleClick} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>Watch Mode</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              The flowchart will automatically run everytime you change a node
              parameter
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WatchBtn;
