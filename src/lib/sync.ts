import { ElementsData } from "@src/types";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";
import { Leaf, RootNode, TreeNode } from "@src/utils/ManifestLoader";
import { Edge, Node } from "reactflow";
import { CtrlData } from "@src/types/node";
import { ctrlsFromParams } from "@src/utils/CtrlsFromParams";
import { isCompatibleType } from "@src/utils/TypeCheck";
import _ from "lodash";

export function syncFlowchartWithManifest(
  nodes: Node<ElementsData>[],
  edges: Edge[],
  blockManifest: RootNode,
  blockMetadata: BlocksMetadataMap,
): [Node<ElementsData>[], Edge[]] {
  const blocks = flattenManifest(blockManifest);

  const inEdges = _.groupBy(edges, (e: Edge) => e.target);
  const newNodes: Node<ElementsData>[] = [];
  const newEdges: Edge[] = [];

  const validEdge = (e: Edge, inputs?: ElementsData["inputs"]) => {
    const outBlock = blocks.get(blockFuncFromId(e.source));
    if (!outBlock) {
      // If there is an unknown block in the flow chart,
      // we want to preserve the structure of the flow
      // to make it easier for the user to fix up,
      // so any edge connected to a block that doesn't
      // exist anymore is kept
      return true;
    }

    const output = outBlock.outputs?.find((o) => o.id === e.sourceHandle);
    const input = (inputs ?? []).find((i) => i.id === e.targetHandle);
    if (input === undefined || output === undefined) {
      return false;
    }

    return isCompatibleType(input.type, output.type);
  };

  for (const node of nodes) {
    // Mark nodes that were deleted in the blocks dir as invalid
    const block = blocks.get(node.data.func);
    const ei = inEdges[node.id] ?? [];

    if (!block) {
      newNodes.push({
        ...node,
        data: {
          ...node.data,
          invalid: true,
        },
      });
      newEdges.push(...ei);
      // Remove all edges connected to the deleted block
      // edges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
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

    newEdges.push(...ei.filter((e) => validEdge(e, newInputs)));

    newNodes.push({
      ...node,
      data: {
        ...node.data,
        ctrls: syncedCtrls,
        initCtrls: syncedInitCtrls,
        inputs: newInputs,
        outputs: newOutputs,
        path: blockMetadata[`${block.key}.py`].path,
        invalid: undefined,
      },
    });
  }

  return [newNodes, newEdges];
}

function getSyncedCtrls(
  block: Leaf,
  ctrls: CtrlData,
  init?: boolean,
): CtrlData {
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
      ...params[name],
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
  };

  dfs(blockManifest);
  return blocks;
}

function blockFuncFromId(blockId: string) {
  return blockId.split("-", 2)[0];
}
