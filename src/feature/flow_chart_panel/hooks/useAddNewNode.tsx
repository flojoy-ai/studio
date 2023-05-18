import { ElementsData } from "../types/CustomNodeProps";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { CMND_MANIFEST } from "../manifest/COMMANDS_MANIFEST";
import { FUNCTION_PARAMETERS } from "../manifest/PARAMETERS_MANIFEST";
import { ParamValueType } from "@feature/common/types/ParamValueType";

const LAST_NODE_POSITION_KEY = "last_node_position:flojoy";

export const useAddNewNode = () => {
  //helper for addNewNode function
  const getNodePosition = () => {
    return {
      x: 50 + Math.random() * 200,
      y: 10 + Math.random() + Math.random() * 40,
    };
  };

  const { nodes, setNodes } = useFlowChartState();
  const lastNodePosition = localStorage.getItem(LAST_NODE_POSITION_KEY)
    ? JSON.parse(localStorage.getItem(LAST_NODE_POSITION_KEY)!)
    : getNodePosition();
  useEffect(() => {
    return () => localStorage.setItem(LAST_NODE_POSITION_KEY, "");
  }, []);
  return (key: string) => {
    const nodePosition = {
      x: lastNodePosition.x + 100,
      y: lastNodePosition.y + 30,
    };
    const cmd = CMND_MANIFEST.find((cmd) => cmd.key === key)!;
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
      const numOfThisNodesOnChart = nodes.filter(
        (node) => node.data.func === funcName
      ).length;
      nodeLabel =
        numOfThisNodesOnChart > 0
          ? `${funcName}_${numOfThisNodesOnChart}`
          : funcName;
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
                  : params![param].default?.toString(),
              ValType: ParamValueType.unknown,
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
    localStorage.setItem(LAST_NODE_POSITION_KEY, JSON.stringify(nodePosition));
  };
};
