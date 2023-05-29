import usePlotLayout from "@src/feature/common/usePlotLayout";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  ControlOptions,
  NodeInputOptions,
  PlotControlOptions,
} from "../../types/ControlOptions";
import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";

export type ControlComponentStateProps = {
  updateCtrlValue: (value: string, ctrl: CtlManifestType) => void;
  ctrlObj: CtlManifestType;
};

const ControlComponentState = ({
  updateCtrlValue,
  ctrlObj,
}: ControlComponentStateProps) => {
  const {
    rfInstance: flowChartObject,
    ctrlsManifest,
    setGridLayout,
    isEditMode,
  } = useFlowChartState();

  const { nodes } = useFlowChartGraph();

  const [selectOptions, setSelectOptions] = useState<ControlOptions[]>([]);
  const [inputOptions, setInputOptions] = useState<NodeInputOptions[]>([]);
  const [outputOptions, setOutputOptions] = useState<ControlOptions[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [numberInput, setNumberInput] = useState<string>("0");
  const [sliderInput, setSliderInput] = useState<string>("0");
  const [currentInputValue, setCurrentInputValue] = useState<
    string | number | boolean
  >(0);
  const [nd, setNd] = useState<ResultIO | null>(null);

  const [plotData, setPlotData] = useState<OverridePlotData>([]);
  const [selectedOption, setSelectedOption] = useState<
    ControlOptions | undefined
  >(undefined);
  const [selectedPlotOption, setSelectedPlotOption] = useState<
    PlotControlOptions | undefined
  >(undefined);

  const styledLayout = usePlotLayout();

  const inputNodeId = (ctrlObj?.param as CtrlManifestParam)?.nodeId;
  const inputNode = nodes.find((e) => e.id === inputNodeId);
  const ctrls: ElementsData["ctrls"] | undefined = inputNode?.data?.ctrls;

  const fnParams =
    FUNCTION_PARAMETERS[(ctrlObj?.param as CtrlManifestParam)?.functionName] ||
    {};
  const fnParam = fnParams[(ctrlObj?.param as CtrlManifestParam)?.param];
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
    setInputOptions,
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
