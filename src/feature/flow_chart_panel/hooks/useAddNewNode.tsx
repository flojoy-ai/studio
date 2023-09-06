import { Leaf as NodeElement } from "@src/utils/ManifestLoader";
import { Draft } from "immer";
import { useCallback } from "react";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { ElementsData } from "@/types";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { centerPositionAtom } from "@src/hooks/useFlowChartState";
import { useAtomValue, useSetAtom } from "jotai";
import { unsavedChangesAtom } from "@src/hooks/useHasUnsavedChanges";
import { addRandomPositionOffset } from "@src/utils/RandomPositionOffset";
import { NodesMetadataMap } from "@src/types/nodes-metadata";

export type AddNewNode = (node: NodeElement) => void;

export const useAddNewNode = (
  setNodes: (
    update:
      | Node<ElementsData>[]
      | ((draft: Draft<Node<ElementsData>>[]) => void),
  ) => void,
  getNodeFuncCount: (func: string) => number,
  nodesMetadataMap: NodesMetadataMap | null,
) => {
  const center = useAtomValue(centerPositionAtom);
  const setHasUnsavedChanges = useSetAtom(unsavedChangesAtom);

  return useCallback(
    (node: NodeElement) => {
      const pos = center ?? { x: 0, y: 0 };
      const nodePosition = addRandomPositionOffset(pos, 30);
      const funcName = node.key;
      const type = node.type;
      const params = node.parameters;
      const initParams = node.init_parameters;
      const inputs = node.inputs;
      const outputs = node.outputs;
      const uiComponentId = node.ui_component_id;
      const pip_dependencies = node.pip_dependencies;
      const path = nodesMetadataMap
        ? nodesMetadataMap[`${funcName}.py`].path
        : "";
      let nodeLabel: string;

      const nodeId = `${funcName}-${uuidv4()}`;
      if (funcName === "CONSTANT") {
        nodeLabel = "3.0";
      } else {
        const numNodes = getNodeFuncCount(funcName);
        nodeLabel = numNodes > 0 ? `${funcName} ${numNodes}` : funcName;
      }
      nodeLabel = nodeLabel.replaceAll("_", " ");

      const createCtrls = (
        params?: NodeElement["parameters"],
      ): ElementsData["ctrls"] => {
        if (!params) {
          return {};
        }

        return Object.entries(params).reduce(
          (prev, [paramName, param]) => ({
            ...prev,
            [paramName]: {
              ...param,
              functionName: funcName,
              param: paramName,
              value: param.default ?? "",
            },
          }),
          {},
        );
      };

      const nodeCtrls = createCtrls(params);
      const initCtrls = createCtrls(initParams);

      const newNode = {
        id: nodeId,
        type: uiComponentId ?? type,
        data: {
          id: nodeId,
          label: nodeLabel,
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
      setNodes((els) => els.concat(newNode));
      setHasUnsavedChanges(true);
      sendEventToMix("Node Added", newNode.data.label);
    },
    [
      setNodes,
      getNodeFuncCount,
      center,
      setHasUnsavedChanges,
      nodesMetadataMap,
    ],
  );
};
