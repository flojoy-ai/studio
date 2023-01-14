import { WritableDraft } from "immer/dist/internal";
import { Edge, Node } from 'reactflow';

export interface FlowChartProps {
  results: any;
  theme: "light" | "dark";
  rfInstance: any;
  setRfInstance: any;
  clickedElement: any;
  setClickedElement: any;
  nodes: Node[];
  setNodes: (
    update: Node<any>[] | ((draft: WritableDraft<Node<any>>[]) => void)
  ) => void;
  edges: Edge[];
  setEdges: (
    update: Edge<any>[] | ((draft: WritableDraft<Edge<any>>[]) => void)
  ) => void;
}
