import { ElementsData } from "@/types";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import * as RECIPES from "../data/RECIPES";
import * as galleryItems from "../data/apps";
import { ExampleProjects } from "../data/docs-example-apps";
import { toast } from "sonner";
import { TextData } from "@src/types/node";
import { sendEventToMix } from "@src/services/MixpanelServices";

const project = resolveDefaultProjectReference();
const projectData = resolveProjectReference(project!) || RECIPES.NOISY_SINE;
const initialNodes: Node<ElementsData>[] = projectData.nodes;
const initialEdges: Edge[] = projectData.edges;

const nodesAtom = atomWithImmer<Node<ElementsData>[]>(initialNodes);
export const textNodesAtom = atomWithImmer<Node<TextData>[]>([]);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);

type UndoRedoStackItem = {
  edges: Edge[];
  nodes: Node<ElementsData>[];
  textNodes: Node<TextData>[];
};

const undoStackAtom = atom<UndoRedoStackItem[]>([]);
const redoStackAtom = atom<UndoRedoStackItem[]>([]);

export const useFlowChartGraph = () => {
  const initialNodesRef = useRef(initialNodes);
  const initialEdgesRef = useRef(initialEdges);

  const [nodes, setNodes] = useAtom(nodesAtom);
  const [textNodes, setTextNodes] = useAtom(textNodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);

  const [undoStack, setUndoStack] = useAtom(undoStackAtom);
  const [redoStack, setRedoStack] = useAtom(redoStackAtom);

  const recordState = useCallback(() => {
    setUndoStack((prev) => [
      ...prev,
      {
        edges,
        nodes,
        textNodes,
      },
    ]);
    setRedoStack([]);
  }, [edges, nodes, textNodes]);

  const canRedo = useMemo(() => redoStack.length > 0, [redoStack]);
  const canUndo = useMemo(() => undoStack.length > 0, [undoStack]);

  const undo = useCallback(() => {
    if (!canUndo) return;

    setUndoStack((prev) => {
      const prevState = prev[prev.length - 2] || {
        edges: initialEdgesRef.current,
        nodes: initialNodesRef.current,
        textNodes: [],
      };
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setTextNodes(prevState.textNodes);
      return prev.slice(0, -1);
    });

    setRedoStack((prev) => [
      ...prev,
      {
        edges,
        nodes,
        textNodes,
      },
    ]);
  }, [edges, nodes, textNodes]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setRedoStack((prev) => {
      const nextState = prev[prev.length - 1];

      if (nextState) {
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
        setTextNodes(nextState.textNodes);
      }

      return prev.slice(0, -1);
    });

    setUndoStack((prev) => [
      ...prev,
      {
        edges,
        nodes,
        textNodes,
      },
    ]);
  }, [edges, nodes, textNodes]);

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
      sendEventToMix("Flow Export Object Loaded", "");
      return true;
    },
    [setNodes, setEdges, setTextNodes],
  );

  useEffect(() => {
    setNodes((prev) => {
      prev.forEach((n) => {
        n.data.selected = n.selected;
      });
    });
  }, [selectedNode, setNodes]);

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
    sendEventToMix("Control Input Data Updated", `${nodeId}: ${inputData}`);
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
    sendEventToMix(
      "Initial Control Input Data Updated",
      `${nodeId}: ${inputData}`,
    );
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
    sendEventToMix("Title Changed", `${id}: ${value}`);
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
    sendEventToMix("Control Input Data Removed", `${nodeId}: ${paramId}`);
  };

  return {
    nodes,
    setNodes,
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
    canRedo,
    canUndo,
    recordState,
    redo,
    undo,
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
  let project: string | undefined;
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    project = query.get("project") || process.env.DEFAULT_PROJECT;
  }
  project = project || process.env.DEFAULT_PROJECT;
  return project;
}
