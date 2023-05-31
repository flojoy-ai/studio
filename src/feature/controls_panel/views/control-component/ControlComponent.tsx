import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Dispatch, memo, SetStateAction } from "react";
import Select, { ThemeConfig } from "react-select";
import customDropdownStyles from "../../style/CustomDropdownStyles";

import useControlComponentEffects from "@hooks/useControlComponentEffects";
import {
  Box,
  clsx,
  createStyles,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import {
  CtlManifestType,
  CtrlManifestParam,
} from "@src/hooks/useFlowChartState";
import { ControlNames } from "../../manifest/CONTROLS_MANIFEST";
import { CtrlOptionValue } from "../../types/ControlOptions";
import KnobCtrl from "../KnobCtrl";
import NodeReference from "../NodeReference";
import PlotControl from "../PlotControl";
import SevenSegmentComponent from "../SevenSegmentComponent";
import ControlComponentState from "./ControlComponentState";

export const useControlStyles = createStyles((theme) => {
  return {
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    btn: {
      cursor: "pointer",
      background: "transparent",
      border: "none",
      margin: 0,
      padding: 5,
      borderRadius: theme.radius.sm,
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[3],
      },
    },
    closeBtn: {
      "&:hover": {
        color: theme.colors.red[7],
      },
    },
    inputBody: {
      padding: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "90%",
      flexWrap: "wrap",
      width: "100%",
    },
    inputBodyFile: {
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      height: "90%",
      flexWrap: "wrap",
      width: "100%",
    },
    param: {
      margin: 0,
      fontSize: 15,
    },
    meta: {
      fontSize: 10,
      textAlign: "left",
      position: "absolute",
      bottom: 10,
      left: 15,
    },
    ctrlNumericInput: {
      padding: 10,
      width: "90%",
      margin: "0 10px",
      backgroundColor: "transparent",
      outline: "none",
      border: `1px solid ${theme.colors.gray[3]}`,
      borderRadius: 10,
    },
    selectNode: {
      fontSize: 12,
      top: 0,
      left: 0,
      border: 0,
      width: "100%",
      borderBottom: `0.5px solid ${theme.colors.gray[3]}`,
      marginBottom: 10,
      paddingRight: 20,
    },
    selectPlotType: {
      fontSize: 12,
      position: "absolute",
      top: 0,
      left: 0,
      border: 0,
      width: "100%",
      borderBottom: `0.5px solid ${theme.colors.gray[3]}`,
      marginBottom: 10,
      paddingRight: 10,
    },
    ctrlInputLabel: {
      marginLeft: 10,
    },
    sevenSegmentContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      paddingBottom: 10,
      minWidth: 480,
      transform: "scale(0.6)",
    },
  };
});

export type ControlComponentProps = {
  ctrlObj: CtlManifestType;
  results: ResultsType;
  updateCtrlValue: (value: string, ctrl: CtlManifestType) => void;
  attachParamsToCtrl: (val: CtrlOptionValue, ctrlObj: CtlManifestType) => void;
  removeCtrl: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ctrl: CtlManifestType
  ) => void;
  setCurrentInput: Dispatch<
    SetStateAction<(CtlManifestType & { index: number }) | undefined>
  >;
  setOpenEditModal: Dispatch<SetStateAction<boolean>>;
};

const ControlComponent = ({
  ctrlObj,
  results,
  updateCtrlValue,
  attachParamsToCtrl,
  removeCtrl,
  setCurrentInput,
  setOpenEditModal,
}: ControlComponentProps) => {
  const { classes } = useControlStyles();
  const theme = useMantineColorScheme().colorScheme;
  const {
    ctrlsManifest,
    setGridLayout,
    isEditMode,
    selectOptions,
    setSelectOptions,
    flowChartObject,
    textInput,
    setTextInput,
    numberInput,
    setNumberInput,
    sliderInput,
    setSliderInput,
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
    setInputOptions,
  } = ControlComponentState({
    updateCtrlValue,
    ctrlObj,
  });

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
          id: `CONSTANT_${value.toString().split(" ").join("")}_constant`,
        },
        { ...ctrlObj, val: value }
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
    defaultValue,
    flowChartObject,
    isEditMode,
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
    setGridLayout,
    setNumberInput,
    setSelectedOption,
    setSelectedPlotOption,
    setSelectOptions,
    setOutputOptions,
    setSliderInput,
    setTextInput,
    openFileSelector,
    setInputOptions,
  });
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: "1",
      }}
      data-cy={ctrlObj.id}
    >
      {isEditMode && (
        <Box className={classes.header} data-cy="ctrls-select">
          <Select
            className={classes.selectNode}
            isSearchable={true}
            onChange={(val) => {
              if (val)
                attachParamsToCtrl(val.value as CtrlOptionValue, ctrlObj);
            }}
            theme={theme as unknown as ThemeConfig}
            options={selectOptions}
            styles={customDropdownStyles}
            value={selectedOption}
            inputId={`select-input-${ctrlObj.id}`}
          />
          <button
            className={classes.btn}
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
            className={clsx(classes.btn, classes.closeBtn)}
          >
            x
          </button>
        </Box>
      )}
      {!isEditMode && (
        <Text
          weight={600}
          sx={{ letterSpacing: 1, fontFamily: "Open Sans" }}
          w="100%"
          ta="left"
        >
          {selectedOption?.label ?? "NODE: "}
        </Text>
      )}

      {/* TODO: Refactor this */}
      {ctrlObj.name === ControlNames.Plot && (
        <PlotControl
          nd={nd}
          setPlotData={setPlotData}
          ctrlObj={ctrlObj}
          isEditMode={isEditMode}
          plotData={plotData}
          selectedPlotOption={selectedPlotOption}
          setSelectedPlotOption={setSelectedPlotOption}
        />
      )}
      {ctrlObj.name === ControlNames.LocalFileLoader && (
        <Box className={classes.inputBodyFile} data-cy="numeric-input">
          <input
            type={"text"}
            placeholder={"Please enter the full file path"}
            className={clsx(classes.ctrlNumericInput, "border-color")}
            onChange={(e) => {
              handleCtrlValueChange(setTextInput, e.target.value);
            }}
            value={currentInputValue || textInput || ""}
          />
          {/* <button
            className="cmd-btn-dark "
            style={{
              ...{color: theme === "dark" ? "#fff" : "#000"}
            }}
            onClick={openFileSelector}
            >
            Select File
          </button> */}
        </Box>
      )}
      {ctrlObj.name === ControlNames.SevenSegmentDisplay && (
        <SevenSegmentComponent ctrlObj={ctrlObj} plotData={plotData} nd={nd} />
      )}

      {ctrlObj.name === ControlNames.TextInput && (
        <Box className={classes.inputBody} data-cy="numeric-input">
          <input
            type="text"
            placeholder="Write your text.."
            className={clsx(classes.ctrlNumericInput, "border-color")}
            onChange={(e) => {
              handleCtrlValueChange(setTextInput, e.target.value);
            }}
            value={currentInputValue || textInput || ""}
          />
        </Box>
      )}

      {ctrlObj.name === ControlNames.NumericInput && (
        <Box className={classes.inputBody} data-cy="numeric-input">
          <input
            type="number"
            placeholder="Enter a number"
            className={clsx(classes.ctrlNumericInput, "border-color")}
            onChange={(e) => {
              handleCtrlValueChange(setNumberInput, e.target.value);
            }}
            value={currentInputValue || numberInput || 0}
          />
        </Box>
      )}
      {ctrlObj.name === ControlNames.ArrayNumericInput && (
        <Box className={classes.inputBody}>
          <input
            type="text"
            placeholder="Enter numbers in CSV format"
            className={clsx(classes.ctrlNumericInput, "border-color")}
            onChange={(e) => {
              handleCtrlValueChange(setTextInput, e.target.value);
            }}
            value={currentInputValue || textInput || ""}
          />
        </Box>
      )}

      {ctrlObj.name === ControlNames.StaticNumericInput && (
        <Box className={classes.inputBody}>
          <input
            type="number"
            placeholder="Enter a number"
            className={classes.ctrlNumericInput}
            onChange={(e) => {
              handleCtrlValueChange(setNumberInput, e.target.value);
            }}
            disabled
            value={currentInputValue || numberInput || 0}
          />
        </Box>
      )}

      {ctrlObj.name === ControlNames.Knob && (
        <Box className={classes.inputBody}>
          <KnobCtrl
            selectedOption={selectedOption}
            ctrlObj={ctrlObj}
            isEditMode={isEditMode}
            makeLayoutStatic={makeLayoutStatic}
            setGridLayout={setGridLayout}
            updateCtrlValue={updateCtrlValue}
            currentInputValue={+currentInputValue}
          />
        </Box>
      )}

      {ctrlObj.name === ControlNames.Slider && (
        <Box className={classes.inputBody}>
          <Box
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
              value={+currentInputValue || +sliderInput || 0}
            />
            <label>{currentInputValue ? currentInputValue : sliderInput}</label>
          </Box>
        </Box>
      )}
      {ctrlObj.name === ControlNames.NodeReference && (
        <NodeReference ctrlObj={ctrlObj} updateCtrlValue={updateCtrlValue} />
      )}
      {ctrlObj.name === ControlNames.Dropdown && (
        <Box className={classes.inputBody}>
          <Select
            className={classes.selectNode}
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
              ) || { label: "", value: "" }
            }
          />
        </Box>
      )}

      {ctrlObj.name === ControlNames.CheckboxButtonGroup && (
        <Box className={classes.inputBody}>
          {paramOptions.map((option) => {
            return (
              <Box key={option.value}>
                <input
                  type="checkbox"
                  id={`${ctrlObj.id}_${option.value}`}
                  name={`${ctrlObj.id}_${option.value}`}
                  value={option.value}
                  checked={currentInputValue.toString() === option.value}
                  onChange={() => {
                    updateCtrlValue(option.value, ctrlObj);
                  }}
                />
                <label htmlFor={`${ctrlObj.id}_${option.value}`}>
                  {" "}
                  {option.label}{" "}
                </label>
              </Box>
            );
          })}
        </Box>
      )}

      {ctrlObj.name === ControlNames.RadioButtonGroup && (
        <Box className={classes.inputBody}>
          {paramOptions.map((option) => {
            return (
              <Box style={{ width: "max-content" }} key={option.value}>
                <input
                  type="radio"
                  id={`${ctrlObj.id}_${option.value}`}
                  name={`${ctrlObj.id}_${option.value}`}
                  value={option.value}
                  checked={currentInputValue.toString() === option.value}
                  onChange={() => {
                    updateCtrlValue(option.value, ctrlObj);
                  }}
                />
                <label htmlFor={`${ctrlObj.id}_${option.value}`}>
                  {" "}
                  {option.label}{" "}
                </label>
              </Box>
            );
          })}
        </Box>
      )}

      <details className={classes.meta}>
        {`Name: ${ctrlObj.name}`}
        <br></br>
        {`ID: ${ctrlObj.id}`}
      </details>
    </Box>
  );
};
export default memo(ControlComponent);
