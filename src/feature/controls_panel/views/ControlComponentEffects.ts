import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { useEffect } from "react";
import { ControlNames, ControlTypes } from "../manifest/CONTROLS_MANIFEST";

const ControlComponentEffects = ({
  flowChartObject,
  localforage,
  flowKey,
  setFlowChartObject,
  setSelectedOption,
  ctrlObj,
  selectOptions,
  results,
  setNd,
  setPlotData,
  nd,
  selectedOption,
  setCurrentInputValue,
  defaultValue,
  ctrls,
  setSelectOptions,
  setKnobValue,
  setTextInput,
  setNumberInput,
  setSliderInput,
}) => {
  useEffect(() => {
    if (Object.keys(flowChartObject).length === 0) {
      localforage
        .getItem(flowKey)
        .then((val) => {
          setFlowChartObject(val);
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [flowChartObject]);

  useEffect(() => {
    setSelectedOption(
      ctrlObj.type === "output"
        ? selectOptions?.find((option: any) => option.value === ctrlObj?.param)
        : selectOptions?.find(
            (option: any) => option.value.id === ctrlObj?.param?.id
          )
    );
  }, [ctrlObj?.param, ctrlObj?.param?.id, selectOptions, ctrlObj?.type]);

  useEffect(() => {
    setNumberInput(0);
    setTextInput("");
    setKnobValue(0);
    setSliderInput(0);
  }, [selectedOption]);
  useEffect(() => {
    try {
      if (ctrlObj.name.toUpperCase() === ControlNames.Plot.toUpperCase()) {
        // figure out what we're visualizing
        let nodeIdToPlot = ctrlObj.param;
        if (nodeIdToPlot) {
          if (results && "io" in results) {
            const runResults = results.io.reverse();
            const filteredResult = runResults.filter(
              (node: any) => nodeIdToPlot === node.id
            )[0];
            setNd(filteredResult === undefined ? {} : filteredResult);
            if (Object.keys(nd).length > 0) {
              if (nd.result) {
                if ("data" in nd.result) {
                  setPlotData(nd.result.data);
                } else {
                  setPlotData([{ x: nd.result["x"], y: nd.result["y"] }]);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [ctrlObj, nd, results, selectedOption]);
  useEffect(() => {
    if (ctrls) {
      setCurrentInputValue(ctrls[ctrlObj?.param?.id]?.value);
    } else {
      setCurrentInputValue(defaultValue);
    }
  }, [ctrls, ctrlObj, selectedOption]);
  useEffect(() => {
    if (ctrlObj.type === ControlTypes.Input) {
      if (flowChartObject.elements !== undefined) {
        flowChartObject.elements.forEach((node: any) => {
          if (!("source" in node)) {
            // Object is a node, not an edge
            const nodeLabel = node.data.label;
            const nodeFunctionName = node.data.func;
            const params = FUNCTION_PARAMETERS[nodeFunctionName];
            const sep = " ▶ ";
            if (params) {
              Object.keys(params).forEach((param) => {
                setSelectOptions((prev) => [
                  ...prev,
                  {
                    label: nodeLabel + sep + param.toUpperCase(),
                    value: {
                      id:
                        nodeFunctionName +
                        "_" +
                        nodeLabel.toString().split(" ").join("") +
                        "_" +
                        param,
                      functionName: nodeFunctionName,
                      param,
                      nodeId: node.id,
                      inputId: ctrlObj.id,
                    },
                  },
                ]);
              });
            }
          }
        });
      }
    } else if (ctrlObj.type === ControlTypes.Output) {
      if (flowChartObject.elements !== undefined) {
        flowChartObject.elements.forEach((node: any) => {
          if (!("source" in node)) {
            // Object is a node, not an edge
            let label =
              "Visualize node: " +
              node.data.label +
              " (#" +
              node.id.slice(-5) +
              ")";
            setSelectOptions((prev) => [
              ...prev,
              { label: label, value: node.id },
            ]);
          }
        });
      }
    }
    return () => {
      setSelectOptions([]);
    };
  }, [ctrlObj, flowChartObject?.elements, ctrlObj?.type]);
};

export default ControlComponentEffects;
