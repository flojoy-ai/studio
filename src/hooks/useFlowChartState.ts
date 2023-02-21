import { NOISY_SINE } from "../data/RECIPES";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect } from "react";
import { Layout } from "react-grid-layout";
import localforage from "localforage";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";

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
}

export interface RfSpatialInfoType {
  x: number;
  y: number;
  zoom: number;
}

const initialNodes: Node[] = NOISY_SINE.nodes;
const initialEdges: Edge[] = NOISY_SINE.edges;
const initialManifests: CtlManifestType[] = [
  {
    type: "input",
    name: "Slider",
    id: "INPUT_PLACEHOLDER",
    hidden: false,
    minHeight: 1,
    minWidth: 2,
  },
];
const failedNodeAtom = atomWithImmer<string>("");
const runningNodeAtom = atomWithImmer<string>("");
const showLogsAtom = atomWithImmer<boolean>(false);
const uiThemeAtom = atomWithImmer<"light" | "dark">("dark");
const rfInstanceAtom = atomWithImmer<
  ReactFlowJsonObject<ElementsData> | undefined
>(undefined);
const nodesAtom = atomWithImmer<Node[]>(initialNodes);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const editModeAtom = atomWithImmer<boolean>(false);
const gridLayoutAtom = atomWithImmer<Layout[]>(
  initialManifests.map((ctrl, i) => ({
    x: 0,
    y: 0,
    h: 2,
    w: 2,
    minH: ctrl.minHeight,
    minW: ctrl.minWidth,
    i: ctrl.id,
  }))
);
localforage.config({ name: "react-flow", storeName: "flows" });

export function useFlowChartState() {
  const flowKey = "flow-joy";
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [uiTheme, setUiTheme] = useAtom(uiThemeAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [runningNode, setRunningNode] = useAtom(runningNodeAtom);
  const [failedNode, setFailedNode] = useAtom(failedNodeAtom);

  const loadFlowExportObject = useCallback(
    (flow: any) => {
      if (!flow) {
        return;
      }
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    },
    [setNodes, setEdges]
  );

  const [openFileSelector, { filesContent }] = useFilePicker({
    readAs: "Text",
    accept: ".txt",
    maxFileSize: 50,
  });

  useEffect(() => {
    // there will be only single file in the filesContent, for each will loop only once
    filesContent.forEach((file) => {
      const parsedFileContent = JSON.parse(file.content);
      setCtrlsManifest(parsedFileContent.ctrlsManifest || initialManifests);
      const flow = parsedFileContent.rfInstance;
      setGridLayout(parsedFileContent.gridLayout);
      loadFlowExportObject(flow);
    });
  }, [filesContent, loadFlowExportObject, setCtrlsManifest, setGridLayout]);

  const saveFile = async () => {
    if (rfInstance) {
      const fileContent = {
        rfInstance,
        ctrlsManifest,
        gridLayout,
      };
      const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

      const blob = new Blob([fileContentJsonString], {
        type: "text/plain;charset=utf-8",
      });
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: "flojoy.txt",
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    }
  };

  const updateCtrlInputDataForNode = (
    nodeId: string,
    paramId: string,
    inputData: {
      functionName: string;
      param: string;
      value: number | string;
    }
  ) => {
    setNodes((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        if (node.data.func === "CONSTANT") {
          const nodeCtrls = node.data.ctrls;
          const splitNodeCtrlKey = Object.keys(nodeCtrls)[0].split("_");
          const ctrlKey =
            splitNodeCtrlKey[0] +
            "_" +
            inputData.value +
            "_" +
            splitNodeCtrlKey[2].toLowerCase();
          node.data.ctrls = {
            [ctrlKey]: inputData,
          };
          node.data.label = inputData.value;
        } else {
          node.data.ctrls[paramId] = inputData;
        }
      }
    });
  };
  const removeCtrlInputDataForNode = (nodeId: string, paramId: string) => {
    setNodes((nodes) => {
      const node = nodes.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls = node.data.ctrls || {};
        delete node.data.ctrls[paramId];
      }
    });
  };

  useEffect(() => {
    setRfInstance((prev) => {
      if (prev) {
        prev.nodes = nodes;
        prev.edges = edges;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);
  return {
    rfInstance,
    setRfInstance,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    ctrlsManifest,
    setCtrlsManifest,
    loadFlowExportObject,
    openFileSelector,
    saveFile,
    isEditMode,
    setIsEditMode,
    gridLayout,
    setGridLayout,
    uiTheme,
    setUiTheme,
    showLogs,
    setShowLogs,
    runningNode,
    setRunningNode,
    failedNode,
    setFailedNode,
    edges,
    setEdges,
    nodes,
    setNodes,
  };
}
