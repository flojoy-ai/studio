import { Dispatch, SetStateAction, useCallback } from "react";
import Plot from "react-plotly.js";
import Select, { ThemeConfig } from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import customDropdownStyles from "../style/CustomDropdownStyles";

import { ControlNames } from "../manifest/CONTROLS_MANIFEST";
import { Silver } from "react-dial-knob";
import ControlComponentState from "./ControlComponentState";
import useControlComponentEffects from "@hooks/useControlComponentEffects";
import {
  CtlManifestType,
  CtrlManifestParam,
  PlotManifestParam,
} from "@src/hooks/useFlowChartState";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";

type ControlComponentProps = {
  ctrlObj: CtlManifestType;
  theme: "light" | "dark";
  results: ResultsType;
  updateCtrlValue: (value: string, ctrl: CtlManifestType) => void;
  attachParamsToCtrl: (val: PlotManifestParam, ctrlObj: CtlManifestType) => void;
  removeCtrl: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ctrl: CtlManifestType
  ) => void;

  setCurrentInput: Dispatch<
    SetStateAction<CtlManifestType & { index: number }>
  >;
  setOpenEditModal: Dispatch<SetStateAction<boolean>>;
};

const ControlComponent = ({
  ctrlObj,
  theme,
  results,
  updateCtrlValue,
  attachParamsToCtrl,
  removeCtrl,
  setCurrentInput,
  setOpenEditModal,
}: ControlComponentProps) => {
  const {
    ctrlsManifest,
    setGridLayout,
    isEditMode,
    selectOptions,
    setSelectOptions,
    flowChartObject,
    setFlowChartObject,
    knobValue,
    setKnobValue,
    textInput,
    setTextInput,
    numberInput,
    setNumberInput,
    sliderInput,
    setSliderInput,
    debouncedTimerForKnobId,
    setDebouncedTimerForKnobId,
    currentInputValue,
    setCurrentInputValue,
    nd,
    setNd,
    plotData,
    setPlotData,
    selectedOption,
    setSelectedOption,
    plotOptions,
    setPlotOptions,
    inputOptions,
    setInputOptions,
    outputOptions,
    setOutputOptions,
    selectedPlotOption,
    setSelectedPlotOption,
    selectedInputOption,
    setSelectedInputOption,
    selectedOutputOption,
    setSelectedOutputOption,
    ctrls,
    defaultValue,
    paramOptions,
    styledLayout,
    localforage,
    flowKey,
  } = ControlComponentState({
    theme,
    ctrlObj,
  });

  const updateCtrlValueFromKnob = useCallback(
    (value: number) => {
      setKnobValue(value);

      if (!(ctrlObj?.param as CtrlManifestParam)?.nodeId) {
        return;
      }
      if (debouncedTimerForKnobId) {
        clearTimeout(debouncedTimerForKnobId);
      }
      const timerId = setTimeout(() => {
        updateCtrlValue(value.toString(), ctrlObj);
      }, 1000);

      setDebouncedTimerForKnobId(timerId);
    },
    [ctrlObj, debouncedTimerForKnobId, updateCtrlValue]
  );

  const handleCtrlValueChange = (
    func: Dispatch<SetStateAction<string>>,
    value: string
  ) => {
    func(value);
    if (!(ctrlObj?.param as CtrlManifestParam)?.nodeId) {
      return;
    }
    updateCtrlValue(value, ctrlObj);
  };

  const makeLayoutStatic = () => {
    if (isEditMode) {
      setGridLayout((prev) => {
        prev[prev.findIndex((layout) => layout.i === ctrlObj.id)].static = true;
      });
    }
  };

  useControlComponentEffects({
    ctrlObj,
    ctrls,
    ctrlsManifest,
    currentInputValue,
    debouncedTimerForKnobId,
    defaultValue,
    flowChartObject,
    flowKey,
    isEditMode,
    knobValue,
    localforage,
    nd,
    numberInput,
    paramOptions,
    plotData,
    results,
    selectedOption,
    selectOptions,
    plotOptions,
    inputOptions,
    outputOptions,
    sliderInput,
    styledLayout,
    textInput,
    selectedPlotOption,
    selectedInputOption,
    selectedOutputOption,
    setCurrentInputValue,
    setDebouncedTimerForKnobId,
    setFlowChartObject,
    setGridLayout,
    setKnobValue,
    setNd,
    setNumberInput,
    setPlotData,
    setSelectedOption,
    setSelectedPlotOption,
    setSelectedInputOption,
    setSelectedOutputOption,
    setSelectOptions,
    setPlotOptions,
    setInputOptions,
    setOutputOptions,
    setSliderInput,
    setTextInput,
  });

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
              if (val) attachParamsToCtrl(val.value, ctrlObj);
            }}
            theme={theme as unknown as ThemeConfig}
            options={selectOptions}
            styles={customDropdownStyles}
            value={selectedOption}
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
      {!isEditMode && (
        <p className="ctrl-param">
          {ctrlObj.type === "output"
            ? selectOptions?.find((option) => option.value === ctrlObj?.param)
              ?.label
            : selectOptions?.find(
              (option) =>
                option.value.id === (ctrlObj?.param as CtrlManifestParam)?.id
            )?.label}
        </p>
      )}

      {isEditMode && ctrlObj.name === ControlNames.Plot && (
        <Select
          className="select-plot-type"
          isSearchable={true}
          onChange={(val) => {
            if (val) {
              attachParamsToCtrl({
                node: selectedOption?.value,
                plot: val.value
              }, ctrlObj);
            }
          }}
          theme={theme as unknown as ThemeConfig}
          options={plotOptions}
          styles={customDropdownStyles}
          value={selectedPlotOption}
        />
      )}

      {!isEditMode && ctrlObj.name === ControlNames.Plot && (
        <p className="ctrl-param">
          Plot: {plotOptions?.find((option) => 
            option.value.type === (ctrlObj?.param as PlotManifestParam)?.plot?.type
            && option.value.mode === (ctrlObj?.param as PlotManifestParam)?.plot?.mode)?.label}
        </p>
        
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
              if (val) {
                attachParamsToCtrl({
                  node: selectedOption?.value,
                  plot: selectedPlotOption?.value,
                  input: val.value,
                  output: selectedOutputOption?.value
                }, ctrlObj);
              }
            }}
            placeholder="Select X"
            options={inputOptions}
            styles={customDropdownStyles}
            theme={theme as unknown as ThemeConfig}
            value={selectedInputOption}
          />
          {(selectedPlotOption?.type !== 'histogram') &&
            <Select
              className="select-plot-type"
              isSearchable={true}
            onChange={(val) => {
              if (val) {
                attachParamsToCtrl({
                  node: selectedOption?.value,
                  plot: selectedPlotOption?.value,
                  input: selectedInputOption?.value,
                  output: val.value
                }, ctrlObj);
              }
            }}
              placeholder="Select Y"
              options={outputOptions}
              styles={customDropdownStyles}
              theme={theme as unknown as ThemeConfig}
              value={selectedOutputOption}
            />}
        </div>
      }

      {ctrlObj.name === ControlNames.Plot && (
        <div
          style={{
            flex: "1",
            height: "100%",
            width: "100%",
            paddingBottom: "10px",
          }}
        >
          <Plot
            data={plotData}
            layout={styledLayout}
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
              handleCtrlValueChange(setTextInput, e.target.value);
            }}
            value={currentInputValue || textInput || ""}
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
              handleCtrlValueChange(setNumberInput, e.target.value);
            }}
            value={currentInputValue || numberInput || 0}
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
              handleCtrlValueChange(setNumberInput, e.target.value);
            }}
            disabled
            value={currentInputValue || numberInput || 0}
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
                handleCtrlValueChange(setSliderInput, val.toString());
              }}
              value={currentInputValue || +sliderInput || 0}
            />
            <label>{currentInputValue ? currentInputValue : sliderInput}</label>
          </div>
        </div>
      )}

      {ctrlObj.name === ControlNames.Dropdown && (
        <div className="ctrl-input-body">
          <Select
            className="select-node"
            isSearchable={true}
            onChange={(val) => {
              updateCtrlValue(
                (val as { label: string; value: string }).value,
                ctrlObj
              );
            }}
            theme={theme as unknown as ThemeConfig}
            options={paramOptions}
            styles={customDropdownStyles}
            value={
              paramOptions.find((opt) => +opt.value === currentInputValue) || ""
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
                  checked={currentInputValue === +option.value}
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
                  checked={currentInputValue === +option.value}
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
