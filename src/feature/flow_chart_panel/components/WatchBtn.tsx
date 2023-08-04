import { Button } from "@src/components/ui/button";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Ban, Watch } from "lucide-react";
import { useEffect, useState } from "react";
import { Node, Edge } from "reactflow";
import { ElementsData } from "flojoy/types";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";

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
    setIsWatching(!isWatching);
  };

  return !isWatching ? (
    <Button size="sm" variant="outline" onClick={handleClick}>
      <Watch size="20" />
      <div className="px-1"></div>
      <div>Watch</div>
    </Button>
  ) : (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => {
        setIsWatching(false);
      }}
    >
      <Ban size="20" />
      <div className="px-1"></div>
      <div>Cancel</div>
    </Button>
  );
};

export default WatchBtn;
