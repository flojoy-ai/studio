import { ElementsData } from "@/types";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useCallback, useEffect, useMemo } from "react";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { NOISY_SINE } from "../data/RECIPES";
import { toast } from "sonner";
import { TextData } from "@src/types/node";
import { API_URI } from "@src/data/constants";
import { NodeSection, validateManifest } from "@src/utils/ManifestLoader";
import type { NodesMetadataMap } from "@src/types/nodes-metadata";

const initialNodes: Node<ElementsData>[] = NOISY_SINE.nodes;
const initialEdges: Edge[] = NOISY_SINE.edges;

const nodesAtom = atomWithImmer<Node<ElementsData>[]>(initialNodes);
export const textNodesAtom = atomWithImmer<Node<TextData>[]>([]);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);
const nodeSectionAtom = atomWithImmer<NodeSection | null>(null);
const nodesMetadataMapAtom = atomWithImmer<NodesMetadataMap | null>(null);

export const useFlowChartGraph = () => {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [textNodes, setTextNodes] = useAtom(textNodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [nodeSection, setNodeSection] = useAtom(nodeSectionAtom);
  const [nodesMetadataMap, setNodesMetadataMap] = useAtom(nodesMetadataMapAtom);
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
    (flow: ReactFlowJsonObject<ElementsData>, textNodes?: Node<TextData>[]) => {
      if (!flow) {
        return false;
      }
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (textNodes) {
        setTextNodes(textNodes);
      }
      return true;
    },
    [setNodes, setEdges, setTextNodes],
  );

  const fetchManifest = useCallback(() => {
    fetch(`${API_URI}/nodes/manifest`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((manifest) => {
        validateManifest(manifest);
        setNodeSection(manifest);
      });
  }, []);
  const fetchMetadata = useCallback(() => {
    fetch(`${API_URI}/nodes/metadata`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((metadata) => {
        setNodesMetadataMap(metadata);
      });
  }, []);

  useEffect(() => {
    setNodes((prev) => {
      prev.forEach((n) => {
        n.data.selected = n.selected;
      });
    });
  }, [selectedNode, setNodes]);
  useEffect(() => {
    fetchManifest();
    fetchMetadata();
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
    inputData: ElementsData["ctrls"][string],
  ) => {
    setNodes((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        if (node.data.initCtrls) {
          node.data.initCtrls[inputData.param].value = inputData.value;
        }
      }
    });
  };

  const handleTitleChange = (value: string, id: string) => {
    const node = nodes.find((n) => n.data.id === id);
    if (value === node?.data.label) {
      return;
    }
    const isDuplicate = nodes.find(
      (n) => n.data.label === value && n.data.id !== id,
    );
    if (isDuplicate) {
      toast.message("Cannot change label", {
        description: `There is another node with the same label: ${value}`,
      });
      return;
    }
    const updatedNodes = nodes?.map((n) => {
      if (n.data.id === id) {
        return { ...n, data: { ...n.data, label: value } };
      }
      return n;
    });
    setNodes(updatedNodes);
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
    nodeSection,
    nodesMetadataMap,
    textNodes,
    setTextNodes,
    edges,
    setEdges,
    selectedNode,
    unSelectedNodes,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    updateInitCtrlInputDataForNode,
    loadFlowExportObject,
    handleTitleChange,
  };
};
