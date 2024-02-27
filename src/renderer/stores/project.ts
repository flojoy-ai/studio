import { Node, Edge } from "reactflow";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BlockData } from "../types/";
import { BlockParameterValue, TextData } from "../types/node";

import * as galleryItems from "../data/apps";
import { ExampleProjects } from "../data/docs-example-apps";
import * as RECIPES from "../data/RECIPES";
import { BlockManifest } from "../utils/ManifestLoader";
import { BlockMetadataMap } from "../types/blocks-metadata";
import { Project } from "../types/project";
import { syncFlowchartWithManifest } from "../lib/sync";
import { sendEventToMix } from "../services/MixpanelServices";
import { Err, Ok, Result } from "@/types/result";

type State = {
  name: string | undefined;
  nodes: Node<BlockData>[]; // TODO: Turn this into a record for fast lookup
  edges: Edge[];
  textNodes: Node<TextData>[];
};

type Actions = {
  loadProject: (
    project: Project,
    manifest: BlockManifest,
    metadata: BlockMetadataMap,
  ) => void;
  updateBlockParameter: (
    blockId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void>;
  updateBlockInitParameter: (
    blockId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void>;
  updateBlockName: (blockId: string, name: string) => Result<void>;

  handleNodeChanges: (
    cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
  ) => void;

  handleEdgeChanges: (cb: (nodes: Edge[]) => Edge[]) => void;
};

const defaultProjectData =
  resolveProjectReference(resolveDefaultProjectReference()) ??
  RECIPES.NOISY_SINE;
const initialNodes: Node<BlockData>[] = defaultProjectData.nodes;
const initialEdges: Edge[] = defaultProjectData.edges;

export const useProjectStore = create<State & Actions>()(
  immer((set) => ({
    name: undefined,
    nodes: initialNodes,
    edges: initialEdges,
    textNodes: [],

    handleNodeChanges: (
      cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
    ) => {
      set((state) => {
        cb(state.nodes);
      });
    },
    handleEdgeChanges: (cb: (edges: Edge[]) => Edge[]) => {
      set((state) => {
        cb(state.edges);
      });
    },

    loadProject: (
      project: Project,
      manifest: BlockManifest,
      metadata: BlockMetadataMap,
    ) => {
      const {
        rfInstance: { nodes, edges },
        textNodes,
      } = project;
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        metadata,
      );
      set({
        nodes: syncedNodes,
        edges: syncedEdges,
        textNodes: textNodes ?? [],
      });

      // toast("Synced blocks with manifest.");

      sendEventToMix("Flow Export Object Loaded");
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
            return Err(new Error("Block not found"));
          }

          block.data.ctrls[paramName].value = value;
          if (block.data.func === "CONSTANT" && paramName === "constant") {
            block.data.label = value?.toString() ?? "CONSTANT";
          }
        });
      } catch (e) {
        return Err(e as Error);
      }

      sendEventToMix("Control Input Data Updated", {
        blockId,
        paramName,
        value,
      });

      return Ok(undefined);
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
        return Err(e as Error);
      }

      sendEventToMix("Control Input Data Updated", {
        blockId,
        paramName,
        value,
      });
      return Ok(undefined);
    },

    updateBlockName: (blockId: string, name: string) => {
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
        return Err(e as Error);
      }

      sendEventToMix("Block Name Changed", { blockId, name });
      return Ok(undefined);
    },
  })),
);

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
