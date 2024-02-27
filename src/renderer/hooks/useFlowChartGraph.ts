import { BlockData } from "@/renderer/types";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useCallback, useMemo } from "react";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import * as RECIPES from "../data/RECIPES";
import * as galleryItems from "../data/apps";
import { ExampleProjects } from "../data/docs-example-apps";
import { toast } from "sonner";
import { TextData } from "@/renderer/types/node";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useFullManifest, useFullMetadata } from "./useManifest";
import { syncFlowchartWithManifest } from "@/renderer/lib/sync";
import useWithPermission from "./useWithPermission";

const project = resolveDefaultProjectReference();
const projectData = resolveProjectReference(project) || RECIPES.NOISY_SINE;
const initialNodes: Node<BlockData>[] = projectData.nodes;
const initialEdges: Edge[] = projectData.edges;

const nodesAtom = atomWithImmer<Node<BlockData>[]>(initialNodes);
export const textNodesAtom = atomWithImmer<Node<TextData>[]>([]);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);

export const useFlowChartGraph = () => {
  const { withPermissionCheck } = useWithPermission();
  const [nodes, setNodesOriginal] = useAtom(nodesAtom);
  const [textNodes, setTextNodes] = useAtom(textNodesAtom);
  const [edges, setEdgesOriginal] = useAtom(edgesAtom);
  const setNodes = withPermissionCheck(setNodesOriginal);
  const setEdges = withPermissionCheck(setEdgesOriginal);
  const { selectedNodes, unSelectedNodes } = useMemo(() => {
    const selectedNodes: Node<BlockData>[] = [];
    const unSelectedNodes: Node<BlockData>[] = [];
    for (const n of nodes) {
      if (n.selected) {
        selectedNodes.push(n);
      } else unSelectedNodes.push(n);
    }
    return { selectedNodes, unSelectedNodes };
  }, [nodes]);
  const selectedNode = selectedNodes.length > 0 ? selectedNodes[0] : null;
  const manifest = useFullManifest();
  const nodesMetadata = useFullMetadata();

  const loadFlowExportObject = useCallback(
    (flow: ReactFlowJsonObject<BlockData>, textNodes?: Node<TextData>[]) => {
      if (!flow) {
        return false;
      }
      if (!manifest) {
        toast.error("Manifest not found!");
        throw new Error("Manifest not found!");
      }
      if (!nodesMetadata) {
        toast.error("Block metadata not found!");
        throw new Error("Block metadata not found!");
      }

      const nodes = flow.nodes || [];
      const edges = flow.edges || [];
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        nodesMetadata,
      );
      setNodes(syncedNodes);
      setEdges(syncedEdges);
      toast("Synced blocks with manifest.");

      if (textNodes) {
        setTextNodes(textNodes);
      }
      sendEventToMix("Flow Export Object Loaded");
      return true;
    },
    [setNodes, setEdges, setTextNodes, manifest, nodesMetadata],
  );

  const updateCtrlInputDataForNode = (
    nodeId: string,
    inputData: BlockData["ctrls"][string],
  ) => {
    setNodesOriginal((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls[inputData.param].value = inputData.value;
        if (node.data.func === "CONSTANT" && inputData.param === "constant") {
          node.data.label = inputData.value?.toString() ?? "CONSTANT";
        }
      }
    });
    sendEventToMix("Control Input Data Updated", { nodeId, inputData });
  };

  const updateInitCtrlInputDataForNode = (
    nodeId: string,
    inputData: BlockData["ctrls"][string],
  ) => {
    setNodesOriginal((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        if (node.data.initCtrls) {
          node.data.initCtrls[inputData.param].value = inputData.value;
        }
      }
    });
    sendEventToMix("Initial Control Input Data Updated", { nodeId, inputData });
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
    sendEventToMix("Title Changed", { id, value });
    setNodes(updatedNodes);
  };

  const handleNodeChanges = (
    cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
  ) => {
    setNodesOriginal(cb);
  };
  const handleEdgeChanges = (cb: (edges: Edge[]) => Edge[]) => {
    setEdgesOriginal(cb);
  };

  return {
    nodes,
    setNodes,
    handleNodeChanges,
    handleEdgeChanges,
    textNodes,
    setTextNodes,
    edges,
    setEdges,
    selectedNode,
    unSelectedNodes,
    updateCtrlInputDataForNode,
    updateInitCtrlInputDataForNode,
    loadFlowExportObject,
    handleTitleChange,
  };
};

function resolveProjectReference(project: string) {
  if (RECIPES[project]) {
    return RECIPES[project];
  } else if (galleryItems[project]) {
    return galleryItems[project].rfInstance;
  } else if (ExampleProjects[project]) {
    return ExampleProjects[project].rfInstance;
  }
}

function resolveDefaultProjectReference() {
  let project;
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    project = query.get("project"); // TODO: set these env through electron API as process is not accessible at this level
  }
  return project;
}
