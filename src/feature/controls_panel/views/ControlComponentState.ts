import styledPlotLayout from "@src/feature/common/defaultPlotLayout";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { useState } from "react";
import {
  ControlOptions,
  NodeInputOptions,
  PlotControlOptions,
} from "../types/ControlOptions";
type ControlComponentStateProps = {
  ctrlObj: CtlManifestType;
  theme: "light" | "dark";
};

const ControlComponentState = ({
  ctrlObj,
  theme,
}: ControlComponentStateProps) => {
  const {
    rfInstance: flowChartObject,
    elements,
    ctrlsManifest,
    setGridLayout,
    isEditMode,
  } = useFlowChartState();

  const [selectOptions, setSelectOptions] = useState<ControlOptions[]>([]);
  const [plotOptions, setPlotOptions] = useState<PlotControlOptions[]>([]);
  const [inputOptions, setInputOptions] = useState<NodeInputOptions[]>([]);
  const [outputOptions, setOutputOptions] = useState<ControlOptions[]>([]);
  const [knobValue, setKnobValue] = useState<number>();
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState("0");
  const [sliderInput, setSliderInput] = useState("0");
  const [debouncedTimerForKnobId, setDebouncedTimerForKnobId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [currentInputValue, setCurrentInputValue] = useState(0);
  const [nd, setNd] = useState<ResultIO | null>(null);

  const [plotData, setPlotData] = useState([
    {
      x: [1, 2, 3],
      y: [1, 2, 3],
      z: [1, 2, 3],
      type: "scatter",
      mode: "lines",
    },
  ]);
  const [selectedOption, setSelectedOption] = useState<
    ControlOptions | undefined
  >(undefined);
  const [selectedPlotOption, setSelectedPlotOption] = useState<
    PlotControlOptions | undefined
  >(undefined);
  const [selectedKeys, setSelectedKeys] = useState<Record<string, any> | null>(
    null
  );
  const styledLayout = styledPlotLayout(theme);

  const inputNodeId = (ctrlObj?.param as CtrlManifestParam)?.nodeId;
  const inputNode = elements.find((e) => e.id === inputNodeId);
  const ctrls = inputNode?.data?.ctrls;
  const fnParams =
    FUNCTION_PARAMETERS[(ctrlObj?.param as CtrlManifestParam)!?.functionName] ||
    {};
  const fnParam = fnParams[(ctrlObj?.param as CtrlManifestParam)?.param!];
  const defaultValue =
    (ctrlObj?.param as CtrlManifestParam)?.functionName === "CONSTANT"
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

  return {
    nd,
    setNd,
    setPlotData,
    selectedPlotOption,
    ctrls,
    defaultValue,
    paramOptions,
    styledLayout,
    ctrlsManifest,
    setGridLayout,
    isEditMode,
    selectOptions,
    setSelectOptions,
    inputOptions,
    outputOptions,
    setOutputOptions,
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
    plotData,
    selectedOption,
    setSelectedOption,
    setSelectedPlotOption,
  };
};

export default ControlComponentState;

export type ControlComponentStateType = ReturnType<
  typeof ControlComponentState
>;
