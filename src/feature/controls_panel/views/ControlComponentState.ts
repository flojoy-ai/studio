import styledPlotLayout from "@src/feature/common/defaultPlotLayout";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useFilePicker } from "use-file-picker";
import {
  ControlOptions,
  NodeInputOptions,
  PlotControlOptions,
} from "../types/ControlOptions";
type ControlComponentStateProps = {
  updateCtrlValue: any;
  ctrlObj: CtlManifestType;
  theme: "light" | "dark";
};

const ControlComponentState = ({
  updateCtrlValue,
  ctrlObj,
  theme,
}: ControlComponentStateProps) => {
  const {
    rfInstance: flowChartObject,
    nodes,
    ctrlsManifest,
    setGridLayout,
    isEditMode,
  } = useFlowChartState();

  const [selectOptions, setSelectOptions] = useState<ControlOptions[]>([]);
  const [plotOptions, setPlotOptions] = useState<PlotControlOptions[]>([]);
  const [inputOptions, setInputOptions] = useState<NodeInputOptions[]>([]);
  const [outputOptions, setOutputOptions] = useState<ControlOptions[]>([]);
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState("0");
  const [sliderInput, setSliderInput] = useState("0");
  const [currentInputValue, setCurrentInputValue] = useState<string| number>(0);
  const [nd, setNd] = useState<ResultIO | null>(null);

  const [plotData, setPlotData] = useState([
    {
      x: [1, 2, 3],
      y: [1, 2, 3],
      z: [1, 2, 3],
      source: "",
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
  const styledLayout = styledPlotLayout(theme);

  const inputNodeId = (ctrlObj?.param as CtrlManifestParam)?.nodeId;
  const inputNode = nodes.find((e) => e.id === inputNodeId);
  const ctrls: ElementsData["ctrls"] = inputNode?.data?.ctrls!;

  const fnParams =
    FUNCTION_PARAMETERS[(ctrlObj?.param as CtrlManifestParam)!?.functionName] ||
    {};
  const fnParam = fnParams[(ctrlObj?.param as CtrlManifestParam)?.param!];
  const defaultValue =
    (ctrlObj?.param as CtrlManifestParam)?.functionName === "CONSTANT"
      ? ctrlObj.val
      : fnParam?.default || 0;

  const paramOptions =
    fnParam?.options?.map((option) => {
      return {
        label: option,
        value: option,
      };
    }) || [];

  const [openFileSelector, { plainFiles }] = useFilePicker({
    // accept: ".txt",
    maxFileSize: 5,
    readFilesContent: false,
    multiple: false,
  });

  useEffect(() => {
    // there will be only single file in the filesContent, for each will loop only once
    plainFiles.forEach((file) => {
      setTextInput(file.name);
      if (!(ctrlObj?.param as CtrlManifestParam)?.nodeId) {
        return;
      }
      updateCtrlValue(file.name, ctrlObj);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plainFiles]);

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
    textInput,
    setTextInput,
    numberInput,
    setNumberInput,
    sliderInput,
    setSliderInput,
    currentInputValue,
    setCurrentInputValue,
    plotData,
    selectedOption,
    setSelectedOption,
    setSelectedPlotOption,
    openFileSelector,
  };
};

export default ControlComponentState;

export type ControlComponentStateType = ReturnType<
  typeof ControlComponentState
>;
