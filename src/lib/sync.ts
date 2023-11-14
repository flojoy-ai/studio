import { ElementsData } from "@src/types";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";
import { Leaf, RootNode, TreeNode } from "@src/utils/ManifestLoader";
import { Edge, Node } from "reactflow";
import { CtrlData } from "@src/types/node";
import { ctrlsFromParams } from "@src/utils/CtrlsFromParams";
import _ from "lodash";

export function syncFlowchartWithManifest(nodes: Node<ElementsData>[], edges: Edge[], blockManifest: RootNode, blockMetadata: BlocksMetadataMap): [Node<ElementsData>[], Edge[]] {
  const blocks = flattenManifest(blockManifest);

  const inEdges = _.groupBy(edges, (e: Edge) => e.target);
  const newNodes: Node<ElementsData>[] = [];
  const newEdges: Edge[] = [];

  const outputExists = (e: Edge) => blocks.get(blockFuncFromId(e.source))?.outputs?.find(o => o.id === e.sourceHandle) !== undefined;
  const inputExists = (e: Edge, inputs?: ElementsData["inputs"]) => (inputs ?? []).find(i => i.id === e.targetHandle) !== undefined;

  for (const node of nodes) {
    // Just delete nodes that were deleted in the blocks dir
    const block = blocks.get(node.data.func);
    if (!block) {
      // Remove all edges connected to the deleted block
      edges = edges.filter(e => e.source !== node.id && e.target !== node.id);
      continue;
    }

    // Sync parameters
    const syncedCtrls = getSyncedCtrls(block, node.data.ctrls);
    const syncedInitCtrls = node.data.initCtrls
      ? getSyncedCtrls(block, node.data.initCtrls, true)
      : undefined;

    // Sync inputs
    const newInputs = block.inputs;
    const newOutputs = block.outputs;
    const ei = inEdges[node.id] ?? [];

    newEdges.push(...ei.filter((e) => inputExists(e, newInputs) && outputExists(e)));

    newNodes.push({
      ...node,
      data: {
        ...node.data,
        ctrls: syncedCtrls,
        initCtrls: syncedInitCtrls,
        inputs: newInputs,
        outputs: newOutputs,
        path: blockMetadata
          ? blockMetadata[`${block.key}.py`].path
          : ""
      }
    })
  }

  return [newNodes, newEdges];
}

function getSyncedCtrls(block: Leaf, ctrls: CtrlData, init?: boolean): CtrlData {
  const params = init ? block.init_parameters : block.parameters;
  if (!params) {
    return {};
  }

  const syncedCtrls = ctrlsFromParams(params, block.key);

  for (const [name, ctrl] of Object.entries(ctrls)) {
    if (!(name in params)) {
      continue;
    }
    const syncedParam = {
      ...ctrl,
      ...params[name]
    };

    // If the type changed, then we need to just reset to the default value
    if (ctrl.type !== params[name].type) {
      syncedParam.value = ctrl.default ?? "";
    }

    syncedCtrls[name] = syncedParam;
  }

  return syncedCtrls;
}

function flattenManifest(blockManifest: RootNode): Map<string, Leaf> {
  const blocks = new Map<string, Leaf>();

  const dfs = (node: TreeNode) => {
    if (!node.children) {
      blocks.set(node.key, node);
      return;
    }

    node.children.map(dfs);
  }

  dfs(blockManifest);
  return blocks;
}

function blockFuncFromId(blockId: string) {
  return blockId.split("-", 2)[0];
}
