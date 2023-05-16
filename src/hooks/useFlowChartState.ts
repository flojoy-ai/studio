import { NOISY_SINE } from "../data/RECIPES";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect, useMemo } from "react";
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
  layout: ReactGridLayout.Layout;
}

export interface RfSpatialInfoType {
  x: number;
  y: number;
  zoom: number;
}

const initialNodes: Node<ElementsData>[] =
  NOISY_SINE.nodes as Node<ElementsData>[];
const initialEdges: Edge[] = NOISY_SINE.edges;
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
const nodesAtom = atomWithImmer<Node<ElementsData>[]>(initialNodes);
const edgesAtom = atomWithImmer<Edge[]>(initialEdges);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const editModeAtom = atomWithImmer<boolean>(false);
const gridLayoutAtom = atomWithImmer<Layout[]>(
  initialManifests.map((ctrl, i) => ({
    ...ctrl.layout,
  }))
);
localforage.config({ name: "react-flow", storeName: "flows" });

export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [runningNode, setRunningNode] = useAtom(runningNodeAtom);
  const [failedNode, setFailedNode] = useAtom(failedNodeAtom);

  // TODO: This still changes every time a node is dragged...
  // Could still be optimized further?
  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedNode = selectedNodes.length > 0 ? selectedNodes[0] : null;

  const loadFlowExportObject = useCallback(
    (flow: any) => {
      if (!flow) {
        return 0;
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
    console.log("29");
    // there will be only single file in the filesContent, for each will loop only once
    filesContent.forEach((file) => {
      const parsedFileContent = JSON.parse(file.content);
      const flow = parsedFileContent.rfInstance;
      setCtrlsManifest(parsedFileContent.ctrlsManifest || initialManifests);
      loadFlowExportObject(flow);
    });
  }, [filesContent, loadFlowExportObject, setCtrlsManifest, setGridLayout]);

  const getFileBlob = (rf: ReactFlowJsonObject<ElementsData>) => {
    const fileContent = {
      rfInstance,
      ctrlsManifest,
    };
    const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

    return new Blob([fileContentJsonString], {
      type: "text/plain;charset=utf-8",
    });
  };

  const saveFile = async () => {
    if (rfInstance) {
      const blob = getFileBlob(rfInstance);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "flojoy.txt";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const saveFileAs = async () => {
    if (rfInstance) {
      const blob = getFileBlob(rfInstance);

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
    inputData: ElementsData["ctrls"][""]
  ) => {
    setNodes((element) => {
      const node = element.find((e) => e.id === nodeId);
      if (node) {
        if (node.data.func === "CONSTANT") {
          node.data.ctrls = {
            [paramId]: inputData,
          };
          node.data.label = inputData.value.toString();
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

  // TODO: Reimplement this
  // useEffect(() => {
  //   console.log("30");
  //   setRfInstance((prev) => {
  //     if (prev) {
  //       prev.nodes = nodes;
  //       prev.edges = edges;
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nodes, edges]);

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
    saveFileAs,
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
    edges,
    setEdges,
    nodes,
    setNodes,
    filesContent,
    selectedNode,
  };
}
