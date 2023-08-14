import { ElementsData } from "@/types";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useCallback, useEffect, useMemo } from "react";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { NOISY_SINE } from "../data/RECIPES";
import { nodeSection, NodeElement } from "@src/utils/ManifestLoader";

const initialNodes: Node<ElementsData>[] = NOISY_SINE.nodes;
const initialEdges: Edge[] = NOISY_SINE.edges;

const nodesAtom = atomWithImmer<Node<ElementsData>[]>(initialNodes);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);
const nodesManifestAtom = atomWithImmer<NodeElement[]>([]);

export const useFlowChartGraph = () => {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [nodesManifest, setNodesManifest] = useAtom(nodesManifestAtom);

  const { selectedNodes, unSelectedNodes } = useMemo(() => {
    const selectedNodes: Node<ElementsData>[] = [];
    const unSelectedNodes: Node<ElementsData>[] = [];
    for (const n of nodes) {
      if (n.selected) {
        selectedNodes.push(n);
      } else unSelectedNodes.push(n);
    }
    return { selectedNodes, unSelectedNodes };
  }, [nodes]);
  const selectedNode = selectedNodes.length > 0 ? selectedNodes[0] : null;

  const loadFlowExportObject = useCallback(
    (flow: ReactFlowJsonObject<ElementsData>) => {
      if (!flow) {
        return false;
      }
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      return true;
    },
    [setNodes, setEdges],
  );

  useEffect(() => {
    setNodes((prev) => {
      prev.forEach((n) => {
        n.data.selected = n.selected;
      });
    });
  }, [selectedNode]);

  /**
   * Creates a node mapping from nodeSection
   */
  const addNodesToManifest = useCallback((arr) => {
    if (!Array.isArray(arr)) {
      return;
    }
    let nodes: NodeElement[] = [];
    arr.forEach((child) => {
      if (child.children === null) {
        nodes = [...nodes, child];
      } else {
        const n = addNodesToManifest(child.children);
        if (n) {
          nodes = [...nodes, ...n];
        }
      }
    });
    return nodes;
  }, []);

  useEffect(() => {
    const allNodes = addNodesToManifest(nodeSection.children);
    if (allNodes) {
      setNodesManifest(allNodes);
    }
  }, []);

  const updateCtrlInputDataForNode = (
    nodeId: string,
    inputData: ElementsData["ctrls"][string],
  ) => {
    setNodes((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls[inputData.param].value = inputData.value;
        if (node.data.func === "CONSTANT" && inputData.param === "constant") {
          node.data.label = inputData.value?.toString() ?? "CONSTANT";
        }
      }
    });
  };

  const updateInitCtrlInputDataForNode = (
    nodeId: string,
    inputData: ElementsData["initCtrls"][string],
  ) => {
    setNodes((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        node.data.initCtrls[inputData.param].value = inputData.value;
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
    unSelectedNodes,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    updateInitCtrlInputDataForNode,
    loadFlowExportObject,
    nodesManifest,
  };
};
