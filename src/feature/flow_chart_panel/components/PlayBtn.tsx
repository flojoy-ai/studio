import { Button } from "@src/components/ui/button";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Node, Edge } from "reactflow";
import { ElementsData } from "flojoy/types";
import { Play } from "lucide-react";

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
    <Button size="sm" variant="outline" onClick={handleClick}>
      <Play size="20" />
      <div className="px-1"></div>
      <div>Play</div>
    </Button>
  );
};

export default PlayBtn;
