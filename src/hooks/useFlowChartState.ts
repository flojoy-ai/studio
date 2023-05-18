import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import localforage from "localforage";
import { Layout } from "react-grid-layout";
import { ReactFlowJsonObject } from "reactflow";

export interface CtrlManifestParam {
  functionName: string;
  param: string;
  nodeId: string;
  id: string;
  type?: string;
}
export interface PlotManifestParam {
  node: string;
  plot?: PlotType;
  input?: string;
  output?: string;
}

interface PlotType {
  type: string;
  mode: string;
}

export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: PlotManifestParam | CtrlManifestParam | string;
  val?: string | number;
  hidden?: boolean;
  segmentColor?: string;
  controlGroup?: string;
  label?: string;
  minHeight: number;
  minWidth: number;
  layout: ReactGridLayout.Layout;
}

export interface RfSpatialInfoType {
  x: number;
  y: number;
  zoom: number;
}

const initialManifests: CtlManifestType[] = [
  {
    type: "input",
    name: "Slider",
    id: "INPUT_PLACEHOLDER",
    hidden: false,
    minHeight: 1,
    minWidth: 2,
    layout: {
      x: 0,
      y: 0,
      h: 2,
      w: 2,
      minH: 1,
      minW: 2,
      i: "INPUT_PLACEHOLDER",
    },
  },
];
const failedNodeAtom = atomWithImmer<string>("");
const runningNodeAtom = atomWithImmer<string>("");
const showLogsAtom = atomWithImmer<boolean>(false);
const rfInstanceAtom = atomWithImmer<
  ReactFlowJsonObject<ElementsData> | undefined
>(undefined);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const editModeAtom = atomWithImmer<boolean>(false);
const gridLayoutAtom = atomWithImmer<Layout[]>(
  initialManifests.map((ctrl, i) => ({
    ...ctrl.layout,
  }))
);
const apiKeyAtom = atomWithImmer<string>("");
const nodeParamChangedAtom = atom<boolean | undefined>(undefined);
localforage.config({ name: "react-flow", storeName: "flows" });

export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [runningNode, setRunningNode] = useAtom(runningNodeAtom);
  const [failedNode, setFailedNode] = useAtom(failedNodeAtom);
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [nodeParamChanged, setNodeParamChanged] = useAtom(nodeParamChangedAtom);

  return {
    rfInstance,
    setRfInstance,
    ctrlsManifest,
    setCtrlsManifest,
    isEditMode,
    setIsEditMode,
    gridLayout,
    setGridLayout,
    showLogs,
    setShowLogs,
    runningNode,
    setRunningNode,
    failedNode,
    setFailedNode,
    apiKey,
    setApiKey,
    nodeParamChanged,
    setNodeParamChanged,
  };
}
