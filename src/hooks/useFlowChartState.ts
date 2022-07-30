import { OnLoadParams, Elements, FlowExportObject } from "react-flow-renderer";
import { NOISY_SINE } from "../data/RECIPES.js";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { saveAs } from "file-saver";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect } from "react";

export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: string;
  val?: any;
  hidden?:boolean;
  controlGroup?: string;
  label?:string;
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
  },
  {
    type: "output",
    name: "Plot",
    id: "OUTPUT_PLACEHOLDER",
    hidden:false
  },
];

const rfInstanceAtom = atomWithImmer<OnLoadParams | undefined>(undefined);
const elementsAtom = atomWithImmer<Elements>(initialElements);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const rfSpatialInfoAtom = atomWithImmer<RfSpatialInfoType>({
  x: 0,
  y: 0,
  zoom: 1,
});
const editModeAtom = atomWithImmer<boolean>(false);
export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [elements, setElements] = useAtom(elementsAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [rfSpatialInfo, setRfSpatialInfo] = useAtom(rfSpatialInfoAtom);
  const [editMode, setEditMode] = useAtom(editModeAtom);

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
      loadFlowExportObject(flow);
    });
  }, [filesContent, loadFlowExportObject, setCtrlsManifest]);

  const saveFile = async () => {
    if (rfInstance) {
      const fileContent = {
        rfInstance: rfInstance.toObject(),
        ctrlsManifest,
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
    setElements((elements) => {
      const node = elements.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls = node.data.ctrls || {};
        node.data.ctrls[paramId] = inputData;
      }
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
    editMode,
    setEditMode
  };
}
