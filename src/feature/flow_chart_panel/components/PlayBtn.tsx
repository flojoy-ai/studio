import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Node, Edge } from "reactflow";
import { ElementsData } from "flojoy/types";
import { Play } from "lucide-react";
import { Button } from "@src/components/ui/button";

interface PlayBtnProps {
  onPlay: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
}

const PlayBtn = ({ onPlay }: PlayBtnProps) => {
  const { nodes, edges } = useFlowChartGraph();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (onPlay) {
      onPlay(nodes, edges);
    }
  };

  useKeyboardShortcut("ctrl", "p", () => onPlay(nodes, edges));
  useKeyboardShortcut("meta", "p", () => onPlay(nodes, edges));

  return (
    <Button
      data-cy="btn-play"
      size="sm"
      variant="default"
      id="btn-play"
      onClick={handleClick}
      disabled={nodes.length === 0}
      className="gap-2"
    >
      <Play size="18" />
      Play
    </Button>
  );
};

export default PlayBtn;
