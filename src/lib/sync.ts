import { ElementsData } from "@src/types";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";
import { Leaf, RootNode, TreeNode } from "@src/utils/ManifestLoader";
import { Edge, Node } from "reactflow";
import { CtrlData } from "@src/types/node";
// import _ from "lodash";

export function syncFlowchartWithManifest(nodes: Node<ElementsData>[], edges: Edge[], blockManifest: RootNode, blockMetadata: BlocksMetadataMap) {
  console.log(blockMetadata);
  const blocks = flattenManifest(blockManifest);

  // const adj = _.groupBy(edges, (e) => e.source);
  //
  const newNodes: Node<ElementsData>[] = [];
  // const newEdges = [];

  for (const node of nodes) {
    // Just delete nodes that were deleted in the blocks dir
    const block = blocks.get(node.data.func);
    if (!block) {
      // Remove all edges connected to the deleted block
      edges = edges.filter(e => e.source !== node.id && e.target !== node.id);
      continue;
    }

    const syncedCtrls = getSyncedCtrls(block, node.data.ctrls);
    const syncedInitCtrls = node.data.initCtrls ? getSyncedCtrls(block, node.data.initCtrls) : undefined;


    newNodes.push({
      ...node,
      data: {
        ...node.data,
        ctrls: syncedCtrls,
        initCtrls: syncedInitCtrls
      }
    })

    // Sync inputs
    // const newInputs = block.inputs;
    // const newOutputs = block.outputs;
    // for (const e of adj[node.id]) {
    //   e.source
    // }
    // newEdges.push(...adj[node.id].filter((e) => (newInputs ?? []).find(i => i.id === e.sourceHandle?.)))
  }

  return newNodes;
}

function getSyncedCtrls(block: Leaf, ctrls: CtrlData): CtrlData {
  if (!block.parameters) {
    return {};
  }

  const syncedCtrls = {};

  for (const [name, ctrl] of Object.entries(ctrls)) {
    if (!(name in block.parameters)) {
      continue;
    }
    const syncedParam = {
      ...ctrl,
      ...block.parameters[name]
    };

    // If the type changed, then we need to just reset to the default value
    if (ctrl.type !== block.parameters[name].type) {
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
