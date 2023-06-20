import { NodeElement } from "@src/utils/ManifestLoader";
import { Draft } from "immer";
import { useCallback, useEffect } from "react";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { ElementsData } from "../types/CustomNodeProps";
import { sendEventToMix } from "@src/services/MixpanelServices";
import NodeFunctionsMap from "@src/data/pythonFunctions.json";

const LAST_NODE_POSITION_KEY = "last_node_position:flojoy";

export type AddNewNode = (node: NodeElement) => void;

export const useAddNewNode = (
  setNodes: (
    update:
      | Node<ElementsData>[]
      | ((draft: Draft<Node<ElementsData>>[]) => void)
  ) => void,
  getNodeFuncCount: (func: string) => number
) => {
  const getNodePosition = () => {
    return {
      x: 50 + Math.random() * 200,
      y: 10 + Math.random() + Math.random() * 40,
    };
  };

  const lastNodePosition = localStorage.getItem(LAST_NODE_POSITION_KEY)
    ? JSON.parse(localStorage.getItem(LAST_NODE_POSITION_KEY) || "")
    : getNodePosition();

  useEffect(() => {
    return () => localStorage.setItem(LAST_NODE_POSITION_KEY, "");
  }, []);

  return useCallback(
    (node: NodeElement) => {
      const nodePosition = {
        x: lastNodePosition.x + 100,
        y: lastNodePosition.y + 30,
      };
      const funcName = node.key;
      const type = node.type;
      const params = node.parameters;
      const inputs = node.inputs;
      const uiComponentId = node.ui_component_id;
      const pip_dependencies = node.pip_dependencies;
      const path = NodeFunctionsMap[`${funcName}.py`]?.path ?? "";
      let nodeLabel: string;

      const nodeId = `${funcName}-${uuidv4()}`;
      if (funcName === "CONSTANT") {
        nodeLabel = "2.0";
      } else {
        const numNodes = getNodeFuncCount(funcName);
        nodeLabel = numNodes > 0 ? `${funcName} ${numNodes}` : funcName;
      }
      nodeLabel = nodeLabel.replaceAll("_", " ");

      const nodeParams = params
        ? Object.entries(params).reduce(
            (prev: ElementsData["ctrls"], [paramName, param]) => ({
              ...prev,
              [paramName]: {
                ...param,
                functionName: funcName,
                param: paramName,
                value:
                  funcName === "CONSTANT" ? nodeLabel : param.default ?? "",
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: nodeId,
        type: uiComponentId || type,
        data: {
          id: nodeId,
          label: nodeLabel,
          func: funcName,
          type,
          ctrls: nodeParams,
          inputs,
          pip_dependencies,
          path,
        },
        position: nodePosition,
      };
      setNodes((els) => els.concat(newNode));
      localStorage.setItem(
        LAST_NODE_POSITION_KEY,
        JSON.stringify(nodePosition)
      );
      sendEventToMix("Node Added", newNode.data.label);
    },
    [setNodes, getNodeFuncCount]
  );
};
