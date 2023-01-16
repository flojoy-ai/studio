import { Dispatch, memo, SetStateAction, useCallback } from "react";
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
import { CtrlOptionValue } from "../types/ControlOptions";
import PlotControl from "./PlotControl";
import SevenSegmentComponent from "./SevenSegmentComponent";

type ControlComponentProps = {
  ctrlObj: CtlManifestType;
  theme: "light" | "dark";
  results: ResultsType;
  updateCtrlValue: (value: string, ctrl: CtlManifestType) => void;
  attachParamsToCtrl: (
    val: CtrlOptionValue | PlotManifestParam,
    ctrlObj: CtlManifestType
  ) => void;
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
    setPlotData,
    selectedPlotOption,
    plotData,
    selectedOption,
    setSelectedOption,
    inputOptions,
    outputOptions,
    setOutputOptions,
    setSelectedPlotOption,
    ctrls,
    defaultValue,
    paramOptions,
    styledLayout,
    openFileSelector,
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
    [ctrlObj, debouncedTimerForKnobId, setDebouncedTimerForKnobId, setKnobValue, updateCtrlValue]
  );

  const handleCtrlValueChange = (
    setValue: Dispatch<SetStateAction<string>>,
    value: string
  ) => {
    setValue(value);
    if (!(ctrlObj?.param as CtrlManifestParam)?.nodeId) {
      return;
    }
    updateCtrlValue(value, ctrlObj);

    if ((ctrlObj.param as CtrlManifestParam).functionName === "CONSTANT") {
      attachParamsToCtrl(
        {
          ...(selectedOption?.value as CtrlOptionValue),
          id: "CONSTANT_" + value + "_constant",
        },
        ctrlObj
      );
    }
  };

  const makeLayoutStatic = () => {
    if (isEditMode) {
      setGridLayout((prev) => {
        prev[prev.findIndex((layout) => layout.i === ctrlObj.id)].static = true;
      });
    }
  };

  useControlComponentEffects({
    nd,
    selectedPlotOption,
    setNd,
    setPlotData,
    ctrlObj,
    ctrls,
    ctrlsManifest,
    currentInputValue,
    debouncedTimerForKnobId,
    defaultValue,
    flowChartObject,
    isEditMode,
    knobValue,
    numberInput,
    paramOptions,
    plotData,
    results,
    selectedOption,
    selectOptions,
    inputOptions,
    outputOptions,
    sliderInput,
    styledLayout,
    textInput,
    setCurrentInputValue,
    setDebouncedTimerForKnobId,
    setGridLayout,
    setKnobValue,
    setNumberInput,
    setSelectedOption,
    setSelectedPlotOption,
    setSelectOptions,
    setOutputOptions,
    setSliderInput,
    setTextInput,
    openFileSelector,
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: "1",
        padding: "16px",
      }}
    >
      {isEditMode && (
        <div
          className="ctrl-header"
          data-cy="ctrls-select"
          style={{ width: "100%" }}
        >
          <Select
            className="select-node"
            isSearchable={true}
            onChange={(val) => {
              if (val)
                attachParamsToCtrl(val.value as CtrlOptionValue, ctrlObj);
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
        <p className="ctrl-param">Node: {selectedOption?.label}</p>
      )}
      {ctrlObj.name === ControlNames.Plot && (
        <PlotControl
          nd={nd}
          results={results}
          setNd={setNd}
          setPlotData={setPlotData}
          ctrlObj={ctrlObj}
          isEditMode={isEditMode}
          plotData={plotData}
          selectedOption={selectedOption}
          selectedPlotOption={selectedPlotOption}
          theme={theme}
          setSelectedPlotOption={setSelectedPlotOption}
        />
      )}
      {ctrlObj.name === ControlNames.LocalFileLoader && (
        <button
          className="save__controls_button"
          style={{
            color: theme === "dark" ? "#fff" : "#000",
          }}
          onClick={openFileSelector}
        >
          Load
        </button>
      )}
      {ctrlObj.name === ControlNames.SevenSegmentDisplay && (
        <SevenSegmentComponent ctrlObj={ctrlObj} plotData={plotData} nd={nd} />
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
              paramOptions.find(
                (opt) => opt.value === currentInputValue.toString()
              ) || ""
            }
          />
        </div>
      )}

      {ctrlObj.name === ControlNames.CheckboxButtonGroup && (
        <div className="ctrl-input-body">
          {paramOptions.map((option) => {
            return (
              <div key={option.value}>
                <input
                  type="checkbox"
                  id={`${ctrlObj.id}_${option.value}`}
                  name={`${ctrlObj.id}_${option.value}`}
                  value={option.value}
                  checked={currentInputValue.toString() === option.value}
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
              <div style={{ width: "max-content" }} key={option.value}>
                <input
                  type="radio"
                  id={`${ctrlObj.id}_${option.value}`}
                  name={`${ctrlObj.id}_${option.value}`}
                  value={option.value}
                  checked={currentInputValue.toString() === option.value}
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

export default memo(ControlComponent);
