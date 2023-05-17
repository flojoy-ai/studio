import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { NOISY_SINE } from "../data/RECIPES";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useCallback, useEffect } from "react";

const initialNodes: Node<ElementsData>[] =
  NOISY_SINE.nodes as Node<ElementsData>[];
const initialEdges: Edge[] = NOISY_SINE.edges;

const nodesAtom = atomWithImmer<Node<ElementsData>[]>(initialNodes);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);

export const useFlowChartNodes = () => {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);

  // TODO: This still changes every time a node is dragged...
  // Could still be optimized further?
  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedNode = selectedNodes.length > 0 ? selectedNodes[0] : null;

  const loadFlowExportObject = useCallback(
    (flow: ReactFlowJsonObject<ElementsData>) => {
      if (!flow) {
        return;
      }
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    },
    [setNodes, setEdges]
  );

  useEffect(() => {
    setNodes((prev) => {
      prev.forEach((n) => {
        n.data.selected = n.selected;
      });
    });
  }, [selectedNode]);

  const updateCtrlInputDataForNode = (
    nodeId: string,
    paramId: string,
    inputData: ElementsData["ctrls"][""]
  ) => {
    setNodes((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        if (node.data.func === "CONSTANT") {
          node.data.ctrls = {
            [paramId]: inputData,
          };
          node.data.label = inputData.value.toString();
        } else {
          node.data.ctrls[paramId] = inputData;
        }
      }
    });
  };

  const removeCtrlInputDataForNode = (nodeId: string, paramId: string) => {
    setNodes((nodes) => {
      const node = nodes.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls = node.data.ctrls || {};
        delete node.data.ctrls[paramId];
      }
    });
  };

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNode,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    loadFlowExportObject,
  };
};
