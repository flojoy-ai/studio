import { OnLoadParams, Elements, FlowExportObject } from "react-flow-renderer";
import { NOISY_SINE } from "../data/RECIPES.js";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { saveAs } from "file-saver";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect } from "react";
import { Layout } from "react-grid-layout";

export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: string;
  val?: any;
  hidden?:boolean;
  controlGroup?: string;
  label?:string;
  minHeight: number;
  minWidth: number;
}

export interface RfSpatialInfoType {
  x: number;
  y: number;
  zoom: number;
}

const initialElements: Elements = NOISY_SINE.elements;
const initialManifests: CtlManifestType[] = [
  {
    type: "input",
    name: "Slider",
    id: "INPUT_PLACEHOLDER",
    hidden: false,
    minHeight:1,
    minWidth:2
  },
  // {
  //   type: "output",
  //   name: "Plot",
  //   id: "OUTPUT_PLACEHOLDER",
  //   hidden:false,
  //   minHeight:300,
  //   minWidth:500
  // },
];
const uiThemeAtom = atomWithImmer<"light" | 'dark'>('dark');
const rfInstanceAtom = atomWithImmer<OnLoadParams | undefined>(undefined);
const elementsAtom = atomWithImmer<Elements>(initialElements);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const rfSpatialInfoAtom = atomWithImmer<RfSpatialInfoType>({
  x: 0,
  y: 0,
  zoom: 1,
});
const editModeAtom = atomWithImmer<boolean>(false);
const gridLayoutAtom = atomWithImmer<Layout[]>(initialManifests.map((ctrl,i)=>({
  x:0,
  y:0,
  h:2,
  w:2,
  minH:ctrl.minHeight,
  minW:ctrl.minWidth,
  i:ctrl.id
})));
export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [elements, setElements] = useAtom(elementsAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [rfSpatialInfo, setRfSpatialInfo] = useAtom(rfSpatialInfoAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [uiTheme, setUiTheme] = useAtom(uiThemeAtom)

  const loadFlowExportObject = useCallback((flow: FlowExportObject ) => {
    if(!flow){
        return;
    }
    setElements(flow.elements || []);
    setRfSpatialInfo({
        x: flow.position[0] || 0,
        y: flow.position[1] || 0,
        zoom: flow.zoom || 0,
    });
  }, [setElements, setRfSpatialInfo])

  const [openFileSelector, { filesContent }] = useFilePicker({
    readAs: "Text",
    accept: ".txt",
    maxFileSize: 50,
  });

  useEffect(() => {
    // there will be only single file in the filesContent, for each will loop only once
    filesContent.forEach((file) => {
      const parsedFileContent = JSON.parse(file.content);
      console.log('parsedFileContent:', parsedFileContent);
      setCtrlsManifest(parsedFileContent.ctrlsManifest || initialManifests);
      const flow = parsedFileContent.rfInstance;
      setGridLayout(parsedFileContent.gridLayout)
      loadFlowExportObject(flow);
    });
  }, [filesContent, loadFlowExportObject, setCtrlsManifest]);

  const saveFile = async () => {
    if (rfInstance) {
      const fileContent = {
        rfInstance: rfInstance.toObject(),
        ctrlsManifest,
        gridLayout
      };
      const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

      var blob = new Blob([fileContentJsonString], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "flojoy.txt");
    }
  };

  const updateCtrlInputDataForNode = (
    nodeId: string,
    paramId: string,
    inputData: any
  ) => {
    setElements(element=> {
    const node = element.find((e) => e.id === nodeId);
        if (node) {
          // console.log(' node.data.ctrls: ', node.data.ctrls)
      // node.data.ctrls = node.data.ctrls || {};
      node.data.ctrls[paramId] = inputData;
    }
    console.log('updated node: ', JSON.stringify(node))
    });
  };
  const removeCtrlInputDataForNode = (
    nodeId: string,
    paramId: string,
  ) => {
    setElements((elements) => {
      const node = elements.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls = node.data.ctrls || {};
        delete node.data.ctrls[paramId];
      }
    });
  };

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
    setUiTheme
  };
}
