import { NodeOnAddFunc } from "../types/NodeAddFunc";
import { ElementsData } from "../types/CustomNodeProps";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { CMND_MANIFEST } from "../manifest/COMMANDS_MANIFEST";
import { FUNCTION_PARAMETERS } from "../manifest/PARAMETERS_MANIFEST";

export const useAddNewNode = () => {
  //helper for addNewNode function
  const getNodePosition = () => {
    return {
      x: 50 + Math.random() * 20,
      y: 50 + Math.random() + Math.random() * 20,
    };
  };

  const { nodes, setNodes } = useFlowChartState();

  return (key: string) => {
    const cmd = CMND_MANIFEST[key];
    const funcName = cmd.key;
    const type = cmd.type;
    const params = FUNCTION_PARAMETERS[cmd.key];
    const inputs = cmd.inputs;
    var uiComponentId;
    if (cmd.ui_component_id) {
      uiComponentId = cmd.ui_component_id;
    }
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
      position: getNodePosition(),
    };
    setNodes((els) => els.concat(newNode));
  };
};

// onAdd({
//   funcName: cmd.key,
//   type: cmd.type,
//   params: FUNCTION_PARAMETERS[cmd.key],
//   inputs: cmd.inputs,
//   ...(cmd.ui_component_id && {
//     uiComponentId: cmd.ui_component_id,
//   }),
//   pip_dependencies: cmd.pip_dependencies,
// });

// export const addNewNode = useCallback(
//   ({ key }) => {
//     const cmd = CMND_MANIFEST[key];
//     const funcName = cmd.key;
//     const type = cmd.type;
//     const params = FUNCTION_PARAMETERS[cmd.key];
//     const inputs = cmd.inputs;
//     var uiComponentId;
//     if (cmd.ui_component_id) {
//         uiComponentId = cmd.ui_component_id;
//     }
//     const pip_dependencies = cmd.pip_dependencies;
//     let nodeLabel: string;
//     const nodeId = `${funcName}-${uuidv4()}`;
//     if (funcName === "CONSTANT") {
//       nodeLabel = "2.0";
//     } else {
//       const numOfThisNodesOnChart = nodes.filter(
//         (node) => node.data.func === funcName
//       ).length;
//       nodeLabel =
//         numOfThisNodesOnChart > 0
//           ? `${funcName}_${numOfThisNodesOnChart}`
//           : funcName;
//     }
//     const nodeParams = params
//       ? Object.keys(params).reduce(
//           (prev: ElementsData["ctrls"], param) => ({
//             ...prev,
//             [param]: {
//               functionName: funcName,
//               param,
//               value:
//                 funcName === "CONSTANT"
//                   ? nodeLabel
//                   : params![param].default?.toString(),
//             },
//           }),
//           {}
//         )
//       : {};

//     const newNode = {
//       id: nodeId,
//       type: uiComponentId || type,
//       data: {
//         id: nodeId,
//         label: nodeLabel,
//         func: funcName,
//         type,
//         ctrls: nodeParams,
//         inputs,
//         pip_dependencies,
//       },
//       position: getNodePosition(),
//     };
//     setNodes((els) => els.concat(newNode));
//   },
//   [nodes, setNodes]
// );
