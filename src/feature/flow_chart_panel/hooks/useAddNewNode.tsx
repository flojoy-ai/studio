import { Draft } from "immer";
import { useCallback, useEffect } from "react";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { CMND_MANIFEST } from "../manifest/COMMANDS_MANIFEST";
import { FUNCTION_PARAMETERS } from "../manifest/PARAMETERS_MANIFEST";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import { ElementsData } from "../types/CustomNodeProps";

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

  // const { nodes, setNodes } = useFlowChartState();
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
      const cmd = CMND_MANIFEST.find((cmd) => cmd.key === key);
      if (cmd === null || cmd === undefined) {
        throw new Error("Command not found");
      }
      const funcName = cmd.key;
      const type = cmd.type;
      const params = FUNCTION_PARAMETERS[cmd.key];
      const inputs = cmd.inputs;
      const uiComponentId = cmd.ui_component_id;
      const pip_dependencies = cmd.pip_dependencies;
      let nodeLabel: string;

      const nodeId = `${funcName}-${uuidv4()}`;
      if (funcName === "CONSTANT") {
        nodeLabel = "2.0";
      } else {
        // Commented out for now for performance reasons.
        // This is because the code causes a dependency on the nodes state,
        // which will cause this hook to be called every time the nodes
        // change.

        // const numOfThisNodesOnChart = nodes.filter(
        //   (node) => node.data.func === funcName
        // ).length;
        // nodeLabel =
        //   numOfThisNodesOnChart > 0
        //     ? `${funcName}_${numOfThisNodesOnChart}`
        //     : funcName;
        const numNodes = getNodeFuncCount(funcName);
        nodeLabel = numNodes > 0 ? `${funcName}_${numNodes}` : funcName;
        // nodeLabel = funcName;
      }
      const nodeParams = params
        ? Object.keys(params).reduce(
            (prev: ElementsData["ctrls"], param) => ({
              ...prev,
              [param]: {
                functionName: funcName,
                param,
                value:
                  funcName === "CONSTANT"
                    ? nodeLabel
                    : params[param].default?.toString(),
                valType: params[param].type as ParamValueType,
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
    },
    [setNodes, getNodeFuncCount]
  );
};
