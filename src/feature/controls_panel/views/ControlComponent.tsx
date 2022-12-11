import { useCallback, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import localforage from "localforage";

import { useFlowChartState } from "../../../hooks/useFlowChartState";
import styledPlotLayout from "../../common/defaultPlotLayout";
import customDropdownStyles from "../style/CustomDropdownStyles";

import { FUNCTION_PARAMETERS } from "../../flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { ControlNames, ControlTypes, PlotTypesManifest } from "../manifest/CONTROLS_MANIFEST";
import { Silver } from "react-dial-knob";
import { ControlOptions } from "../types/ControlOptions";

localforage.config({ name: "react-flow", storeName: "flows" });

const flowKey = "flow-joy";

const ControlComponent = ({
  ctrlObj,
  theme,
  results,
  updateCtrlValue,
  attachParamsToCtrl,
  removeCtrl,
  setCurrentInput,
  setOpenEditModal,
}) => {
  const { elements, ctrlsManifest, setGridLayout, isEditMode } =
    useFlowChartState();

  const [flowChartObject, setFlowChartObject] = useState<any>({});
  const [knobValue, setKnobValue] = useState<number>();
  const [debouncedTimerForKnobId, setDebouncedTimerForKnobId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const updateCtrlValueFromKnob = useCallback(
    (value) => {
      setKnobValue(value);

      if (!ctrlObj?.param?.nodeId) {
        return;
      }
      if (debouncedTimerForKnobId) {
        clearTimeout(debouncedTimerForKnobId);
      }
      const timerId = setTimeout(() => {
        updateCtrlValue(value, ctrlObj);
      }, 1000);

      setDebouncedTimerForKnobId(timerId);
    },
    [ctrlObj, debouncedTimerForKnobId, updateCtrlValue]
  );

  const styledLayout = styledPlotLayout(theme);

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

  let options: ControlOptions[] = [];
  let plotOptions: ControlOptions[] = [];
  let inputOptions: ControlOptions[] = [];
  let outputOptions: ControlOptions[] = [];

  if (ctrlObj.type === ControlTypes.Input) {
    if (flowChartObject.elements !== undefined) {
      flowChartObject.elements.forEach((node) => {
        if (!("source" in node)) {
          // Object is a node, not an edge
          const nodeLabel = node.data.label;
          const nodeFunctionName = node.data.func;
          const params = FUNCTION_PARAMETERS[nodeFunctionName];
          const sep = " ▶ ";
          if (params) {
            Object.keys(params).forEach((param) => {
              options.push({
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
              });
            });
          }
        }
      });
    }
  } else if (ctrlObj.type === ControlTypes.Output) {
    if (flowChartObject.elements !== undefined) {
      flowChartObject.elements.forEach((node) => {
        if (!("source" in node)) {
          // Object is a node, not an edge
          let label =
            "Visualize node: " +
            node.data.label +
            " (#" +
            node.id.slice(-5) +
            ")";
          options.push({ label: label, value: node.id });
        }
      });
    }

    if (ctrlObj.name === ControlNames.Plot) {
      PlotTypesManifest.forEach((item) => {
        plotOptions.push({ label: item.name, value: {type: item.type, mode: item.mode || undefined}});
      });
    }
  }

  let selectedPlotType = ctrlObj?.param?.plotType ? ctrlObj?.param?.plotType : { type: 'scatter', mode: 'lines' }
  let selectedNode = ctrlObj?.param?.node;

  let nd: any = {};
  let plotData: any = [{ ...selectedPlotType, x: [1, 2, 3], y: [1, 2, 3], z: [1, 2, 3] }];

  try {
    if (ctrlObj.name.toUpperCase() === ControlNames.Plot.toUpperCase()) {
      // figure out what we're visualizing
      let nodeIdToPlot = ctrlObj.param.node;
      if (nodeIdToPlot) {
        if (results && "io" in results) {
          const runResults = results.io.reverse();
          const filteredResult = runResults.filter(
            (node) => nodeIdToPlot === node.id
          )[0];
          console.log("filteredResult: ", filteredResult);

          nd = filteredResult === undefined ? {} : filteredResult;
          if (Object.keys(nd).length > 0) {
            if (nd.result) {
              if ("data" in nd.result) {
                plotData = nd.result.data;
              } else {
                if (ctrlObj.name === ControlNames.Plot) {
                  const type = selectedPlotType?.type;
                  const mode = selectedPlotType?.mode;
                  if (typeof nd.result["x"] === 'object') {
                    for (const [key, value] of Object.entries(nd.result["x"])) {
                      inputOptions.push({ label: key, value: value });
                    }
                  } else {
                    inputOptions.push({ label: 'x', value: nd.result["x"] })
                  }
                  if (selectedPlotType.type === 'histogram') {
                    inputOptions.push({ label: 'y', value: nd.result["y"] })
                  }

                  outputOptions.push({ label: 'y', value: nd.result["y"] })

                  plotData = [{ x: nd.result["x"], y: nd.result["y"], z: Array(nd.result["x"].length).fill(0), type, mode }];
                } else {
                  plotData = [{ x: nd.result["x"], y: nd.result["y"]}];
                }
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  const inputNodeId = ctrlObj?.param?.nodeId;
  const inputNode = elements.find((e) => e.id === inputNodeId);
  const ctrls = inputNode?.data?.ctrls;
  const fnParams = FUNCTION_PARAMETERS[ctrlObj?.param?.functionName] || {};
  const fnParam = fnParams[ctrlObj?.param?.param];
  const defaultValue =
    ctrlObj?.param?.functionName === "CONSTANT"
      ? ctrlObj.val
      : fnParam?.default
      ? fnParam.default
      : 0;
  const paramOptions =
    fnParam?.options?.map((option) => {
      return {
        label: option,
        value: option,
      };
    }) || [];

  let currentInputValue =
    ctrlObj?.param?.functionName === "CONSTANT"
      ? defaultValue
      : ctrls
      ? ctrls[ctrlObj?.param?.id]?.value
      : defaultValue;

  const makeLayoutStatic = () => {
    if (isEditMode) {
      setGridLayout((prev) => {
        prev[prev.findIndex((layout) => layout.i === ctrlObj.id)].static = true;
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1",
        padding: "16px",
      }}
    >
      {isEditMode && (
        <div className="ctrl-header" data-cy="ctrls-select">
          <Select
            className="select-node"
            isSearchable={true}
            onChange={(val) => {
              console.log("value in select:", val, options);
              if (val) {
                selectedNode = val.value;
                attachParamsToCtrl({node: val.value, plotType: selectedPlotType}, ctrlObj);
              }
            }}
            options={options}
            styles={customDropdownStyles}
            theme={theme}
            value={
              ctrlObj.type === "output"
                ? options?.find((option) => option.value === ctrlObj?.param?.node)
                : options?.find(
                    (option) => option.value.id === ctrlObj?.param?.id
                  )
            }
          />
          <button
            className="ctrl-edit-btn"
            onClick={() => {
              setCurrentInput({
                ...ctrlObj,
                index: ctrlsManifest.findIndex(
                  (manifest) => manifest.id === ctrlObj.id
                ),
              });
              setOpenEditModal(true);
            }}
          >
            &#9998;
          </button>

          <button
            onClick={(e) => removeCtrl(e, ctrlObj)}
            id={ctrlObj.id}
            className="ctrl-edit-btn"
          >
            x
          </button>
        </div>
      )}

      {isEditMode && ctrlObj.name === ControlNames.Plot && (
        <Select
          className="select-plot-type"
          isSearchable={true}
          onChange={(val) => {
            console.log("plot type value in select:", val, plotOptions);
            if (val) {
              selectedPlotType = val.value;
              attachParamsToCtrl({ node: selectedNode, plotType: val.value }, ctrlObj);
            }
          }}
          options={plotOptions}
          styles={customDropdownStyles}
          theme={theme}
          value={
            plotOptions?.find((option) => option.value.type === ctrlObj?.param?.plotType.type
             && option.value.mode === ctrlObj?.param?.plotType.mode)
          }
        />
      )}
      
      {(isEditMode && ctrlObj.name === ControlNames.Plot) &&
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: "1",
          }}
        >
        <Select
          className="select-plot-type"
          isSearchable={true}
          onChange={(val) => {
            console.log("input value in select:", val, plotOptions);
            if (val) {

            }
          }}
          placeholder="Select X"
          options={inputOptions}
          styles={customDropdownStyles}
          theme={theme}
        />
        {(selectedPlotType.type !== 'histogram') && 
        <Select
          className="select-plot-type"
          isSearchable={true}
          onChange={(val) => {
            console.log("output value in select:", val, plotOptions);
            if (val) {
            }
          }}
          placeholder="Select Y"
          options={outputOptions}
          styles={customDropdownStyles}
          theme={theme}
        />}
        </div>
      }

      {!isEditMode && (
        <p className="ctrl-param">
          {ctrlObj.type === "output"
            ? options?.find((option) => option.value === ctrlObj?.param?.node)?.label
            : options?.find((option) => option.value.id === ctrlObj?.param?.id)
                ?.label}
        </p>
      )}

      {!isEditMode && ctrlObj.name === ControlNames.Plot && (
        <p className="ctrl-param">
          Plot: {plotOptions?.find((option) => option.value.type === ctrlObj?.param?.plotType.type
            && option.value.mode === ctrlObj?.param?.plotType.mode)?.label
          }
        </p>
      )}

      {ctrlObj.name === ControlNames.Plot && (
        <div
          style={{
            flex: "1",
            height: "100%",
            width: "100%",
            paddingBottom: "20px",
          }}
        >
          <Plot
            data={plotData}
            layout={styledLayout}
            autosize={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {ctrlObj.name === ControlNames.TextInput && (
        <div className="ctrl-input-body" data-cy="numeric-input">
          <input
            type="text"
            placeholder="Write your text.."
            className="ctrl-numeric-input border-color"
            onChange={(e) => {
              updateCtrlValue(e.target.value, ctrlObj);
            }}
            value={currentInputValue || ""}
            style={{ ...(theme === "dark" && { color: "#fff" }) }}
          />
        </div>
      )}

      {ctrlObj.name === ControlNames.NumericInput && (
        <div className="ctrl-input-body" data-cy="numeric-input">
          <input
            type="number"
            placeholder="Enter a number"
            className="ctrl-numeric-input border-color"
            onChange={(e) => {
              updateCtrlValue(e.target.value, ctrlObj);
            }}
            value={currentInputValue || 0}
            style={{ ...(theme === "dark" && { color: "#fff" }) }}
          />
        </div>
      )}

      {ctrlObj.name === ControlNames.StaticNumericInput && (
        <div className="ctrl-input-body">
          <input
            type="number"
            placeholder="Enter a number"
            className="ctrl-numeric-input"
            onChange={(e) => {
              updateCtrlValue(e.target.value, ctrlObj);
            }}
            disabled
            value={currentInputValue || 0}
          />
        </div>
      )}

      {ctrlObj.name === ControlNames.Knob && (
        <div className="ctrl-input-body">
          <div
            onMouseEnter={makeLayoutStatic}
            onMouseLeave={() => {
              if (isEditMode) {
                setGridLayout((prev) => {
                  prev[
                    prev.findIndex((layout) => layout.i === ctrlObj.id)
                  ].static = false;
                });
              }
            }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Silver
              style={{ width: "fit-content", boxShadow: "0" }}
              // diameter={70}
              knobStyle={{ boxShadow: "0" }}
              min={0}
              max={100}
              step={1}
              value={knobValue || currentInputValue || 0}
              diameter={120}
              onValueChange={updateCtrlValueFromKnob}
              ariaLabelledBy={"my-label"}
            >
              {/* <label id={'my-label'}>Some label</label> */}
            </Silver>
          </div>
        </div>
      )}

      {ctrlObj.name === ControlNames.Slider && (
        <div className="ctrl-input-body">
          <div
            onMouseEnter={makeLayoutStatic}
            onMouseLeave={() => {
              if (isEditMode) {
                setGridLayout((prev) => {
                  prev[
                    prev.findIndex((layout) => layout.i === ctrlObj.id)
                  ].static = false;
                });
              }
            }}
            style={{ width: "100%" }}
          >
            <Slider
              className="custom-slider"
              onChange={(val) => {
                updateCtrlValue(val, ctrlObj);
              }}
              value={currentInputValue || 0}
            />
            <label>{currentInputValue || null}</label>
          </div>
        </div>
      )}

      {ctrlObj.name === ControlNames.Dropdown && (
        <div className="ctrl-input-body">
          <Select
            className="select-node"
            isSearchable={true}
            onChange={(val) => {
              updateCtrlValue(val.value, ctrlObj);
            }}
            options={paramOptions}
            styles={customDropdownStyles}
            theme={theme}
            value={
              paramOptions.find((opt) => opt.value === currentInputValue) || ""
            }
          />
        </div>
      )}

      {ctrlObj.name === ControlNames.CheckboxButtonGroup && (
        <div className="ctrl-input-body">
          {paramOptions.map((option) => {
            return (
              <div>
                <input
                  type="checkbox"
                  id={`${ctrlObj.id}_${option.value}`}
                  name={`${ctrlObj.id}_${option.value}`}
                  value={option.value}
                  checked={currentInputValue === option.value}
                  onChange={(e) => {
                    updateCtrlValue(option.value, ctrlObj);
                  }}
                />
                <label htmlFor={`${ctrlObj.id}_${option.value}`}>
                  {" "}
                  {option.label}{" "}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {ctrlObj.name === ControlNames.RadioButtonGroup && (
        <div className="ctrl-input-body">
          {paramOptions.map((option) => {
            return (
              <div style={{ width: "max-content" }}>
                <input
                  type="radio"
                  id={`${ctrlObj.id}_${option.value}`}
                  name={`${ctrlObj.id}_${option.value}`}
                  value={option.value}
                  checked={currentInputValue === option.value}
                  onChange={(e) => {
                    updateCtrlValue(option.value, ctrlObj);
                  }}
                />
                <label htmlFor={`${ctrlObj.id}_${option.value}`}>
                  {" "}
                  {option.label}{" "}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <details className="ctrl-meta">
        {`Name: ${ctrlObj.name}`}
        <br></br>
        {`ID: ${ctrlObj.id}`}
      </details>
    </div>
  );
};

export default ControlComponent;
