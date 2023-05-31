import { CtrlOptionValue } from "@src/feature/controls_panel/types/ControlOptions";
import { ControlComponentStateType } from "@src/feature/controls_panel/views/control-component/ControlComponentState";
import { getManifestParams } from "@src/utils/ManifestLoader";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { useEffect } from "react";
import { ControlTypes } from "../feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { CtlManifestType, CtrlManifestParam } from "./useFlowChartState";

const useControlComponentEffects = ({
  flowChartObject,
  setSelectedOption,
  ctrlObj,
  selectOptions,
  selectedOption,
  setCurrentInputValue,
  defaultValue,
  ctrls,
  setSelectOptions,
  setTextInput,
  setNumberInput,
  setSliderInput,
  setNd,
  results,
}: ControlComponentStateType & {
  ctrlObj: CtlManifestType;
  results: ResultsType;
}) => {
  useEffect(() => {
    setSelectedOption(
      ctrlObj.type === "output"
        ? selectOptions?.find((option) => option.value === ctrlObj?.param)
        : selectOptions?.find((option) => {
            return (
              (option.value as CtrlOptionValue).id ===
                (ctrlObj?.param as CtrlManifestParam)?.id &&
              (option.value as CtrlOptionValue).nodeId ===
                (ctrlObj?.param as CtrlManifestParam)?.nodeId
            );
          })
    );
  }, [ctrlObj?.param, selectOptions, ctrlObj.type, setSelectedOption]);

  useEffect(() => {
    return () => {
      setNumberInput("0");
      setTextInput("");
      setSliderInput("0");
    };
  }, [selectedOption]);
  useEffect(() => {
    if (ctrls) {
      const value = ctrls[(ctrlObj?.param as CtrlManifestParam)?.param]?.value;
      setCurrentInputValue(isNaN(+value) ? value : +value);
    } else {
      setCurrentInputValue(defaultValue as number);
    }
  }, [ctrls, ctrlObj, selectedOption]);
  // Filter attached node result from all node results
  useEffect(() => {
    try {
      // figure out what we're visualizing
      const nodeIdToPlot = ctrlObj?.param;
      if (nodeIdToPlot) {
        if (results && results.io) {
          const runResults = results.io.reverse();
          const filteredResult = runResults.filter(
            (node) => nodeIdToPlot === node.id
          )[0];
          setNd(filteredResult === undefined ? null : filteredResult);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [ctrlObj?.param, results, results.io, selectedOption, setNd]);

  useEffect(() => {
    if (ctrlObj.type === ControlTypes.Input) {
      if (flowChartObject?.nodes !== undefined) {
        flowChartObject.nodes.forEach((node) => {
          const nodeLabel = node.data.label;
          const nodeFunctionName = node.data.func;
          const params = getManifestParams()[nodeFunctionName];
          const sep = " ▶ ";
          if (params) {
            Object.keys(params).forEach((param) => {
              setSelectOptions((prev) => [
                ...prev,
                {
                  label: nodeLabel + sep + param.toUpperCase(),
                  value: {
                    id: `${nodeFunctionName}_${nodeLabel
                      .toString()
                      .split(" ")
                      .join("")}_${param}`,
                    functionName: nodeFunctionName,
                    param,
                    nodeId: node.id,
                    inputId: ctrlObj.id,
                    type: params[param].type as string,
                  },
                },
              ]);
            });
          }
        });
      }
    } else if (ctrlObj.type === ControlTypes.Output) {
      if (flowChartObject?.nodes) {
        flowChartObject.nodes.forEach((node) => {
          const label = `Visualize node: ${node.data.label} (#${node.id.slice(
            -5
          )})`;
          setSelectOptions((prev) => [
            ...prev,
            { label: label, value: node.id },
          ]);
        });
      }
    }
    return () => {
      setSelectOptions([]);
    };
  }, [ctrlObj, flowChartObject?.nodes, ctrlObj?.type]);

  // Filter attached node result from all node results
  useEffect(() => {
    try {
      // figure out what we're visualizing
      const nodeIdToPlot = ctrlObj?.param;
      if (nodeIdToPlot) {
        if (results && results.io) {
          const runResults = results.io.reverse();
          const filteredResult = runResults.filter(
            (node) => nodeIdToPlot === node.id
          )[0];
          setNd(filteredResult === undefined ? null : filteredResult);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [ctrlObj.param, results.io, selectedOption]);
};

export default useControlComponentEffects;
