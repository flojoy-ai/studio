import { getManifestParams, getManifestCmds } from "@src/utils/ManifestLoader";
import { Draft } from "immer";
import { useCallback, useEffect } from "react";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { ElementsData } from "../types/CustomNodeProps";
import { sendEventToMix } from "@src/services/MixpanelServices";

const LAST_NODE_POSITION_KEY = "last_node_position:flojoy";

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
    (key: string) => {
      const nodePosition = {
        x: lastNodePosition.x + 100,
        y: lastNodePosition.y + 30,
      };
      const cmd = getManifestCmds().find((cmd) => cmd.key === key);
      if (cmd === null || cmd === undefined) {
        throw new Error("Command not found");
      }
      const funcName = cmd.key;
      const type = cmd.type;
      const params = getManifestParams()[cmd.key];
      const inputs = cmd.inputs;
      const uiComponentId = cmd.ui_component_id;
      const pip_dependencies = cmd.pip_dependencies;
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
        ? Object.keys(params).reduce(
            (prev: ElementsData["ctrls"], param) => ({
              ...prev,
              [param]: {
                functionName: funcName,
                param,
                value:
                  funcName === "CONSTANT" ? nodeLabel : params[param].default,
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
