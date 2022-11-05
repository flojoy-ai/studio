import { useCallback, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import localforage from "localforage";

import { useFlowChartState } from "../../hooks/useFlowChartState";
import styledPlotLayout from "../common/defaultPlotLayout";
import customDropdownStyles from "./style/customDropdownStyles";

import { FUNCTION_PARAMETERS } from "../../feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { ControlNames, ControlTypes } from "./manifest/CONTROLS_MANIFEST";
import { Silver } from "react-dial-knob";

localforage.config({ name: "react-flow", storeName: "flows" });

const flowKey = "flow-joy";

const ControlComponent = ({
  ctrlObj,
  theme,
  results,
  updateCtrlValue,
  attachParam2Ctrl,
  rmCtrl,
  setCurrentInput,
  setOPenEditModal,
}) => {
  const [flowChartObject, setFlowChartObject] = useState({});
  const { elements, ctrlsManifest, setGridLayout } = useFlowChartState();
  const [knobValue, setKnobValue] = useState(undefined);
  const [debouncedTimerForKnobId, setDebouncedTimerForKnobId] =
    useState(undefined);
  const { isEditMode } = useFlowChartState();
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

  let options = [];

  if (ctrlObj.type === ControlTypes.Input) {
    if (flowChartObject.elements !== undefined) {
      flowChartObject.elements.forEach((node) => {
        if ("source" in node === false) {
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
                    param.toUpperCase(),
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
    console.log("output", flowChartObject);
    if (flowChartObject.elements !== undefined) {
      flowChartObject.elements.forEach((node) => {
        if ("source" in node === false) {
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
  }
  let plotData = [{ x: [1, 2, 3], y: [1, 2, 3] }];
  let nd = {};

  if (ctrlObj.name.toUpperCase() === ControlNames.Plot.toUpperCase()) {
    // figure out what we're visualizing
    let nodeIdToPlot = ctrlObj.param;
    if (nodeIdToPlot) {
      if (results && "io" in results) {
        const runResults = JSON.parse(results.io).reverse();
        const filteredResult = runResults.filter(
          (node) => nodeIdToPlot === node.id
        )[0];
        console.log("filteredResult:", filteredResult);
        nd = filteredResult === undefined ? {} : filteredResult;
        if (Object.keys(nd).length > 0) {
          if (nd.result) {
            if ("data" in nd.result) {
              plotData = nd.result.data;
            } else {
              plotData = [{ x: nd.result["x"], y: nd.result["y"] }];
            }
          }
        }
      }
    }
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
        <div className="ctrl-header">
          <Select
            className="select-node"
            isSearchable={true}
            onChange={(val) => {
              console.log("value in select:", val, options);
              attachParam2Ctrl(val.value, ctrlObj);
            }}
            options={options}
            styles={customDropdownStyles}
            theme={theme}
            value={
              ctrlObj.type === "output"
                ? options?.find((option) => option.value === ctrlObj?.param)
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
              setOPenEditModal(true);
            }}
          >
            &#9998;
          </button>

          <button
            onClick={(e) => rmCtrl(e, ctrlObj)}
            id={ctrlObj.id}
            className="ctrl-edit-btn"
          >
            x
          </button>
        </div>
      )}
      {!isEditMode && (
        <p className="ctrl-param">
          {ctrlObj.type === "output"
            ? options?.find((option) => option.value === ctrlObj?.param)?.label
            : options?.find((option) => option.value.id === ctrlObj?.param?.id)
                ?.label}
        </p>
      )}

      {ctrlObj.name === ControlNames.Plot && (
        <div
          style={{
            flex: "1",
            height: "100%",
            widht: "100%",
            paddingBottom: "10px",
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

      {ctrlObj.name === ControlNames.NumericInput && (
        <div className="ctrl-input-body">
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
              style={{ width: "fit-content", boxShadow: 0 }}
              // diameter={70}
              knobStyle={{ boxShadow: 0 }}
              min={0}
              max={100}
              step={1}
              value={knobValue || currentInputValue || 0}
              diameter={120}
              onValueChange={updateCtrlValueFromKnob}
              ariaLabelledBy={"my-label"}
            >
              {/* <label id={'my-label'}>Some slabel</label> */}
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
                <label for={`${ctrlObj.id}_${option.value}`}>
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
                <label for={`${ctrlObj.id}_${option.value}`}>
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