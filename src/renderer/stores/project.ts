import { Node, Edge, XYPosition, Connection, addEdge } from "reactflow";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  TextData,
  BlockData,
  positionSchema,
  EdgeData,
} from "@/renderer/types/block";
import { useShallow } from "zustand/react/shallow";

import * as galleryItems from "@/renderer/data/apps";
import { ExampleProjects } from "@/renderer/data/docs-example-apps";
import * as RECIPES from "@/renderer/data/RECIPES";
import { syncFlowchartWithManifest } from "@/renderer/lib/sync";
import {
  MixPanelEvents,
  sendEventToMix,
} from "@/renderer/services/MixpanelServices";
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/renderer/types/project";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { Draft } from "immer";
import { useCallback, useEffect, useMemo } from "react";
import {
  useManifestStore,
  useManifest,
  useMetadata,
} from "@/renderer/stores/manifest";
import {
  createBlockId,
  createBlockLabel,
  addRandomPositionOffset,
  ctrlsFromParams,
} from "@/renderer/lib/block";
import { filterMap } from "@/renderer/utils/array";
import { getEdgeTypes, isCompatibleType } from "@/renderer/lib/type-check";
import { toast } from "sonner";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import { Result, ok, err, fromThrowable, fromPromise } from "neverthrow";
import { useSocketStore } from "./socket";
import { useHardwareStore } from "./hardware";
import { DeviceInfo } from "@/renderer/types/hardware";
import { tryParse } from "@/types/result";
import {
  BlockDefinition,
  BlockParameterValue,
} from "@/renderer/types/manifest";

type State = {
  name: string | undefined;
  path: string | undefined;
  hasUnsavedChanges: boolean;

  nodes: Node<BlockData>[]; // TODO: Turn this into a record for fast lookup
  edges: Edge<EdgeData>[];
  textNodes: Node<TextData>[];
};

type Actions = {
  setProjectName: (name: string) => void;

  updateBlockParameter: (
    blockId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void, Error>;
  updateBlockInitParameter: (
    blockId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void, Error>;
  updateBlockLabel: (blockId: string, name: string) => Result<void, Error>;

  handleNodeChanges: (
    cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
  ) => void;
  handleTextNodeChanges: (
    cb: (nodes: Node<TextData>[]) => Node<TextData>[],
  ) => void;
  handleEdgeChanges: (cb: (nodes: Edge[]) => Edge[]) => void;

  addTextNode: (position: XYPosition) => void;
  updateTextNodeText: (id: string, text: string) => Result<void, Error>;
  deleteTextNode: (id: string) => void;

  saveProject: () => Promise<Result<string | undefined, Error>>;
};

const defaultProjectData =
  resolveProjectReference(resolveDefaultProjectReference()) ??
  RECIPES.NOISY_SINE;
const initialNodes: Node<BlockData>[] = defaultProjectData.nodes;
const initialEdges: Edge[] = defaultProjectData.edges;

export const useProjectStore = create<State & Actions>()(
  immer((set, get) => ({
    name: undefined,
    setProjectName: (name: string) => {
      set({ name });
    },

    path: undefined,
    hasUnsavedChanges: false,

    nodes: initialNodes,
    edges: initialEdges,
    textNodes: [],

    handleNodeChanges: (
      cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
    ) => {
      set((state) => {
        state.nodes = cb(state.nodes);
      });
    },
    handleTextNodeChanges: (
      cb: (nodes: Node<TextData>[]) => Node<TextData>[],
    ) => {
      set((state) => {
        state.textNodes = cb(state.textNodes);
      });
    },
    handleEdgeChanges: (cb: (edges: Edge[]) => Edge[]) => {
      set((state) => {
        state.edges = cb(state.edges);
      });
    },

    updateBlockParameter: (
      blockId: string,
      paramName: string,
      value: BlockParameterValue,
    ) => {
      try {
        set((state) => {
          const block = state.nodes.find((e) => e.id === blockId);
          if (!block) {
            throw new Error("Block not found");
          }

          block.data.ctrls[paramName].value = value;
          if (block.data.func === "CONSTANT" && paramName === "constant") {
            block.data.label = value?.toString() ?? "CONSTANT";
          }
        });
      } catch (e) {
        return err(e as Error);
      }

      sendEventToMix("Control Input Data Updated", {
        blockId,
        paramName,
        value,
      });
      setHasUnsavedChanges(true);

      return ok(undefined);
    },

    updateBlockInitParameter: (
      blockId: string,
      paramName: string,
      value: BlockParameterValue,
    ) => {
      try {
        set((state) => {
          const block = state.nodes.find((e) => e.id === blockId);
          if (!block) {
            throw new Error("Block not found");
          }

          if (!block.data.initCtrls) {
            throw new Error("Block has no init parameters");
          }

          block.data.initCtrls[paramName].value = value;
        });
      } catch (e) {
        return err(e as Error);
      }

      sendEventToMix("Control Input Data Updated", {
        blockId,
        paramName,
        value,
      });

      setHasUnsavedChanges(true);

      return ok(undefined);
    },

    updateBlockLabel: (blockId: string, name: string) => {
      try {
        set((state) => {
          const node = state.nodes.find((n) => n.data.id === blockId);
          if (node === undefined) {
            throw new Error("Block not found");
          }

          if (name === node?.data.label) {
            return;
          }

          const isDuplicate = state.nodes.find(
            (n) => n.data.label === name && n.data.id !== blockId,
          );
          if (isDuplicate) {
            throw new Error(
              `There is another node with the same label: ${name}`,
            );
          }
          node.data.label = name;
        });
      } catch (e) {
        return err(e as Error);
      }

      sendEventToMix("Block Name Changed", { blockId, name });
      setHasUnsavedChanges(true);

      return ok(undefined);
    },

    addTextNode: (pos: XYPosition) => {
      set((state) => {
        state.textNodes.push({
          id: `TextNode-${uuidv4()}`,
          position: addRandomPositionOffset(pos, 30),
          type: "TextNode",
          data: {
            text: "Enter text here",
          },
        });
      });

      setHasUnsavedChanges(true);
    },

    updateTextNodeText: (id: string, text: string) => {
      try {
        set((state) => {
          const node = state.textNodes.find((n) => n.id === id);
          if (node === undefined) {
            throw new Error("Text node not found");
          }
          node.data.text = text;
        });
      } catch (e) {
        return err(e as Error);
      }
      sendEventToMix("Text Node Updated", { id, text });
      setHasUnsavedChanges(true);
      return ok(undefined);
    },

    deleteTextNode: (id: string) => {
      set((state) => {
        state.textNodes = state.textNodes.filter((n) => n.id !== id);
      });
      setHasUnsavedChanges(true);
    },

    saveProject: async () => {
      const fileContent = JSON.stringify(
        {
          name: get().name,
          rfInstance: {
            nodes: get().nodes,
            edges: get().edges,
          },
          textNodes: get().textNodes,
        },
        undefined,
        4,
      );

      const projectPath = get().path;
      if (projectPath) {
        sendEventToMix("Saving Project");
        const save = fromThrowable(
          () => window.api.saveFile(projectPath, fileContent),
          (e) => e as Error,
        );
        return save().andThen(() => {
          setHasUnsavedChanges(false);
          return ok(projectPath);
        });
      }

      const basename =
        get()
          .name?.split(" ")
          .map((s) => s.toLowerCase().trim())
          .filter((s) => s !== "")
          .join("-") ?? "app";
      const defaultFilename = `${basename}.json`;

      return fromPromise(
        window.api.saveFileAs(defaultFilename, fileContent),
        (e) => e as Error,
      ).map(({ filePath, canceled }) => {
        if (canceled || filePath === undefined) {
          return undefined;
        }

        set({ path: filePath });

        setHasUnsavedChanges(false);
        return filePath;
      });
    },
  })),
);

export const useLoadProject = () => {
  const wipeBlockResults = useSocketStore(
    useShallow((state) => state.wipeBlockResults),
  );

  const manifest = useManifest();
  const metadata = useMetadata();

  return useCallback(
    (project: Project, path?: string): Result<void, Error> => {
      if (!manifest || !metadata) {
        return err(
          new Error(
            "Manifest and metadata are still loading, can't load project yet.",
          ),
        );
      }

      const {
        name,
        rfInstance: { nodes, edges },
        textNodes,
      } = project;
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        metadata,
      );

      useProjectStore.setState({
        nodes: syncedNodes,
        edges: syncedEdges,
        textNodes: textNodes ?? [],
        name,
        path,
      });

      setHasUnsavedChanges(false);
      wipeBlockResults();

      sendEventToMix("Project Loaded");

      return ok(undefined);
    },
    [manifest, metadata, wipeBlockResults],
  );
};

export const useAddBlock = () => {
  const setNodes = useProtectedSetter("nodes");

  const center = useFlowchartStore(useShallow((state) => state.centerPosition));
  const hardwareDevices: DeviceInfo | undefined = useHardwareStore(
    useShallow((state) => state.devices),
  );
  const metadata = useMetadata();

  return useCallback(
    (node: BlockDefinition) => {
      const previousBlockPos = localStorage.getItem("prev_node_pos");

      const pos = tryParse(positionSchema)(previousBlockPos).unwrapOr(center);

      const nodePosition = addRandomPositionOffset(pos, 300);
      const {
        key: funcName,
        type,
        parameters: params,
        init_parameters: initParams,
        inputs,
        outputs,
        pip_dependencies,
      } = node;

      const path =
        metadata && `${funcName}.py` in metadata
          ? metadata[`${funcName}.py`].path
          : "";

      const nodeId = createBlockId(node.key);
      const nodeLabel =
        funcName === "CONSTANT"
          ? params!["constant"].default?.toString()
          : createBlockLabel(node.key, getTakenNodeLabels(funcName));

      const nodeCtrls = ctrlsFromParams(params, funcName, hardwareDevices);
      const initCtrls = ctrlsFromParams(initParams, funcName);

      const newNode: Node<BlockData> = {
        id: nodeId,
        type,
        data: {
          id: nodeId,
          label: nodeLabel ?? "New Block",
          func: funcName,
          type,
          ctrls: nodeCtrls,
          initCtrls: initCtrls,
          inputs,
          outputs,
          pip_dependencies,
          path,
        },
        position: nodePosition,
      };

      setNodes((nodes) => {
        nodes.push(newNode);
      });

      localStorage.setItem("prev_block_pos", JSON.stringify(nodePosition));
      sendEventToMix("Node Added", { nodeTitle: newNode.data?.label ?? "" });
    },
    [setNodes, center, metadata, hardwareDevices],
  );
};

export const useDeleteBlock = () => {
  const setNodes = useProtectedSetter("nodes");
  const setEdges = useProtectedSetter("edges");

  return useCallback(
    (nodeId: string, nodeLabel: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      sendEventToMix(MixPanelEvents.nodeDeleted, { nodeTitle: nodeLabel });
    },
    [setNodes, setEdges],
  );
};

export const useDuplicateBlock = () => {
  const setNodes = useProtectedSetter("nodes");

  return useCallback(
    (node: Node<BlockData>): Result<void, Error> => {
      const funcName = node.data.func;
      const id = createBlockId(funcName);

      const newNode: Node<BlockData> = {
        ...node,
        id,
        data: {
          ...node.data,
          id,
          label:
            node.data.func === "CONSTANT"
              ? node.data.ctrls["constant"].value!.toString()
              : createBlockLabel(funcName, getTakenNodeLabels(funcName)),
        },
        position: {
          x: node.position.x + 30,
          y: node.position.y + 30,
        },
        selected: true,
      };

      try {
        setNodes((prev) => {
          const original = prev.find((n) => node.id === n.id);
          if (!original) {
            throw new Error("Failed to find original node when duplicating");
          }

          original.selected = false;
          prev.push(newNode);
        });
      } catch (e) {
        return err(e as Error);
      }

      return ok(undefined);
    },
    [setNodes],
  );
};

export const useCreateEdge = () => {
  const setEdges = useProtectedSetter("edges");
  const manifest = useManifest();

  return (connection: Connection): Result<void, Error | TypeError> => {
    if (!manifest) {
      return err(new Error("Manifest not found, can't connect to edge"));
    }

    const [sourceType, targetType] = getEdgeTypes(manifest, connection);
    if (!isCompatibleType(sourceType, targetType)) {
      return err(
        new TypeError(
          `Source type ${sourceType} and target type ${targetType} are not compatible`,
        ),
      );
    }

    setEdges((edges) => {
      const edgeExists = edges.find(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle,
      );
      if (edgeExists || !connection.source || !connection.target) {
        return edges;
      }
      const newEdge: Edge<EdgeData> = {
        id: `${connection.source}->${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        data: { outputType: sourceType.split("|")[0] },
      };
      return edges.concat(newEdge);
    });
    return ok(undefined);
  };
};

export const useGraphResync = () => {
  const setNodes = useProtectedSetter("nodes");
  const setEdges = useProtectedSetter("edges");

  const { nodes, edges } = useProjectStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
    })),
  );

  const manifest = useManifest();
  const metadata = useMetadata();
  const { manifestChanged, setManifestChanged } = useManifestStore(
    useShallow((state) => ({
      manifestChanged: state.manifestChanged,
      setManifestChanged: state.setManifestChanged,
    })),
  );

  useEffect(() => {
    if (manifest && metadata && manifestChanged) {
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        metadata,
      );

      setNodes(syncedNodes);
      setEdges(syncedEdges);
      toast("Synced blocks with manifest.");
      setManifestChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, metadata, manifestChanged]);
};

export const useAddTextNode = () => {
  const addTextNode = useProjectStore(useShallow((state) => state.addTextNode));
  const center = useFlowchartStore(useShallow((state) => state.centerPosition));

  return useCallback(() => {
    const pos = center ?? { x: 0, y: 0 };
    addTextNode(pos);
    sendEventToMix("Text Node Added");
  }, [addTextNode, center]);
};

export const useClearCanvas = () => {
  const setNodes = useProtectedSetter("nodes");
  const setEdges = useProtectedSetter("edges");
  const setTextNodes = useProtectedSetter("textNodes");

  return () => {
    setNodes([]);
    setEdges([]);
    setTextNodes([]);
  };
};

function useProtectedSetter<K extends keyof State>(field: K) {
  const { withPermissionCheck } = useWithPermission();
  type T = State[K];
  return useMemo(() => {
    return withPermissionCheck((update: T | ((draft: Draft<T>) => void)) => {
      if (typeof update === "function") {
        useProjectStore.setState((state) => {
          const res = update(state[field]);
          if (res !== undefined) {
            state[field] = res;
          }
        });
      } else {
        useProjectStore.setState({ [field]: update });
      }
      setHasUnsavedChanges(true);
    });
  }, [field, withPermissionCheck]);
}

const setHasUnsavedChanges = (val: boolean) => {
  useProjectStore.setState({ hasUnsavedChanges: val });
  window.api.setUnsavedChanges(true);
};

const getTakenNodeLabels = (func: string) => {
  const { nodes } = useProjectStore.getState();
  const re = new RegExp(`^${func.replaceAll("_", " ")}( \\d+)?$`);
  const matches = filterMap(nodes, (n) => n.data.label.match(re));
  return matches;
};

function resolveDefaultProjectReference() {
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    return query.get("project"); // TODO: set these env through electron API as process is not accessible at this level
  }
  return undefined;
}

function resolveProjectReference(project: string | null | undefined) {
  if (!project) {
    return null;
  }

  if (RECIPES[project]) {
    return RECIPES[project];
  } else if (galleryItems[project]) {
    return galleryItems[project].rfInstance;
  } else if (ExampleProjects[project]) {
    return ExampleProjects[project].rfInstance;
  }
}
