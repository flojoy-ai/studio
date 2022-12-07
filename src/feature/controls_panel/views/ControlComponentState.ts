import styledPlotLayout from "@src/feature/common/defaultPlotLayout";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useState } from "react";
import { ControlOptions } from "../types/ControlOptions";

const ControlComponentState = ({ ctrlObj, theme }) => {
  const { elements, ctrlsManifest, setGridLayout, isEditMode } =
    useFlowChartState();

  const [selectOptions, setSelectOptions] = useState<ControlOptions[]>([]);
  const [flowChartObject, setFlowChartObject] = useState<any>({});
  const [knobValue, setKnobValue] = useState<number>();
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState(0);
  const [sliderInput, setSliderInput] = useState(0);
  const [debouncedTimerForKnobId, setDebouncedTimerForKnobId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [currentInputValue, setCurrentInputValue] = useState(null);
  const [nd, setNd] = useState<Record<string, any>>({});
  const [plotData, setPlotData] = useState([{ x: [1, 2, 3], y: [1, 2, 3] }]);
  const [selectedOption, setSelectedOption] = useState<any>("");
  const styledLayout = styledPlotLayout(theme);

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
    fnParam?.options?.map((option: any) => {
      return {
        label: option,
        value: option,
      };
    }) || [];
  return {
    ctrls,
    defaultValue,
    paramOptions,
    styledLayout,
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
  };
};

export default ControlComponentState;
