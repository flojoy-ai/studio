import { Elements, FlowExportObject } from "react-flow-renderer";
import { NOISY_SINE } from "../data/RECIPES";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { saveAs } from "file-saver";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect } from "react";
import { Layout } from "react-grid-layout";

export interface CtrlManifestParam {
  functionName: string;
  param: string;
  nodeId: string;
  id: string;
}
export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: string | CtrlManifestParam;
  val?: string | number;
  hidden?: boolean;
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

const initialElements: Elements = [];
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
const showLogsAtom = atomWithImmer<boolean>(false);
const uiThemeAtom = atomWithImmer<"light" | "dark">("dark");
const rfInstanceAtom = atomWithImmer<FlowExportObject<any> | undefined>(
  undefined
);
const elementsAtom = atomWithImmer<Elements>(initialElements);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const rfSpatialInfoAtom = atomWithImmer<RfSpatialInfoType>({
  x: 0,
  y: 0,
  zoom: 1,
});
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
export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [elements, setElements] = useAtom(elementsAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [rfSpatialInfo, setRfSpatialInfo] = useAtom(rfSpatialInfoAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [uiTheme, setUiTheme] = useAtom(uiThemeAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);

  const loadFlowExportObject = useCallback(
    (flow: FlowExportObject) => {
      if (!flow) {
        return;
      }
      setElements(flow.elements || []);
      setRfSpatialInfo({
        x: flow.position[0] || 0,
        y: flow.position[1] || 0,
        zoom: flow.zoom || 0,
      });
    },
    [setElements, setRfSpatialInfo]
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
      console.log("parsedFileContent:", parsedFileContent);
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
      saveAs(blob, "flojoy.txt");
    }
  };

  const updateCtrlInputDataForNode = (
    nodeId: string,
    paramId: string,
    inputData: {
      functionName: string;
      param: string;
      value: string | number;
    }
  ) => {
    setElements((element) => {
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
            splitNodeCtrlKey[2];
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
    setElements((elements) => {
      const node = elements.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls = node.data.ctrls || {};
        delete node.data.ctrls[paramId];
      }
    });
  };

  const fetchExampleApp = (fileName: string) => {
    fetch("/example-apps/" + fileName, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCtrlsManifest(data.ctrlsManifest || initialManifests);
        const flow = data.rfInstance;
        setGridLayout(data.gridLayout);
        loadFlowExportObject(flow);
      })
      .catch((err) => console.log("fetch example app err: ", err));
  };

  useEffect(() => {
    if (elements?.length === 0) {
      const queryString = window?.location?.search;
      const fileName =
        queryString.startsWith("?test_example_app") &&
        queryString.split("=")[1];
      fetchExampleApp(fileName || "flojoy.txt");
    }
  }, [window?.location?.search]);
  useEffect(() => {
    setRfInstance((prev) => {
      if (prev) {
        prev.elements = elements;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);
  return {
    rfInstance,
    setRfInstance,
    elements,
    setElements,
    rfSpatialInfo,
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
  };
}
