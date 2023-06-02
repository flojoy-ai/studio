import clone from "just-clone";
import localforage from "localforage";
import { useCallback, useState } from "react";
import "./style/Controls.css";

import { createStyles } from "@mantine/styles";
import { AddCTRLBtn } from "@src/AddCTRLBtn";
import "@src/App.css";
import { EditSwitch } from "@src/EditSwitch";
import { Layout } from "@src/Layout";
import { getManifestParams, ManifestParams } from "@src/utils/ManifestLoader";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "../common/Sidebar/Sidebar";
import { useControlsTabEffects } from "./ControlsTabEffects";
import { useControlsTabState } from "./ControlsTabState";
import { CTRL_MANIFEST, CTRL_TREE } from "./manifest/CONTROLS_MANIFEST";
import { CtrlOptionValue } from "./types/ControlOptions";
import ControlGrid from "./views/ControlGrid";
import { useControlsState } from "@src/hooks/useControlsState";
import { useLoaderData } from "react-router-dom";

export const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.modal[0],
      border: theme.colors.accent1[0],
      cursor: "pointer",
    },
  };
});

localforage.config({ name: "react-flow", storeName: "flows" });

export const ControlsTabLoader = () => {
  const manifestParams: ManifestParams = getManifestParams();
  return { manifestParams };
};

const ControlsTab = () => {
  const { manifestParams } = useLoaderData() as {
    manifestParams: ManifestParams;
  };

  const [ctrlSidebarOpen, setCtrlSidebarOpen] = useState(false);

  const {
    states: { programResults },
  } = useSocket();

  const { setOpenEditModal, setCurrentInput } = useControlsTabState();

  const { isEditMode, setIsEditMode } = useFlowChartState();

  const { ctrlsManifest, setCtrlsManifest, maxGridLayoutHeight } =
    useControlsState();

  const { nodes, updateCtrlInputDataForNode } = useFlowChartGraph();
  function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  useControlsTabEffects();

  if (!programResults) {
    return <div>No program results</div>;
  }

  //function for handling a CTRL add (assume that input is key from manifest)
  const addCtrl = useCallback(
    (ctrlKey: string) => {
      setCtrlSidebarOpen(false); //close the sidebar when adding a ctrl
      const ctrlObj = CTRL_MANIFEST[ctrlKey].find((c) => c.key === ctrlKey);
      if (!ctrlObj) {
        console.error("Could not find ctrl object for key", ctrlKey);
        return;
      }

      const id = `ctrl-${uuidv4()}`;
      const yPos = maxGridLayoutHeight;

      const ctrlLayout = {
        x: 0,
        y: yPos + 1,
        h: Math.max(ctrlObj.minHeight, 2),
        w: 2,
        i: id,
        minH: ctrlObj.minHeight,
        minW: ctrlObj.minWidth,
        static: !isEditMode,
      };

      const ctrl: CtlManifestType = {
        ...ctrlObj,
        hidden: false,
        id,
        layout: ctrlLayout,
      } as CtlManifestType;

      cacheManifest([...ctrlsManifest, ctrl]);
    },
    [maxGridLayoutHeight]
  );

  const removeCtrl = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ctrl: CtlManifestType
  ) => {
    const ctrlId = (e.target as HTMLButtonElement).id;
    console.warn("Removing", ctrlId, ctrl);
    const filterChilds = ctrlsManifest.filter((ctrl) => ctrl.id !== ctrlId);
    cacheManifest(filterChilds);
  };

  const updateCtrlValue = (val: string, ctrl: CtlManifestType) => {
    const manClone = clone(ctrlsManifest);
    cacheManifest(manClone);

    if (ctrl.param) {
      updateCtrlInputDataForNode(
        (ctrl.param as CtrlManifestParam).nodeId,
        (ctrl.param as CtrlManifestParam).param,
        {
          functionName: (ctrl.param as CtrlManifestParam).functionName,
          param: (ctrl.param as CtrlManifestParam).param,
          value: val,
        }
      );
    } else {
      console.error("Cannot update nonexistant parameter");
    }
  };

  const attachParamsToCtrl = (
    param: CtrlOptionValue,
    ctrl: CtlManifestType
  ) => {
    // grab the current value for this param if it already exists in the flowchart nodes
    const inputNode = nodes.find((e) => e.id === param.nodeId);
    const ctrls = inputNode?.data?.ctrls;
    const fnParams = manifestParams[param.functionName] || {};
    // debugger
    const fnParam = fnParams[param?.param];
    const defaultValue =
      param.functionName === "CONSTANT"
        ? ctrl.val
        : fnParam?.default
        ? fnParam.default
        : 0;
    const ctrlData = ctrls && ctrls[param.param];

    let inputValue: string | number | boolean | undefined = undefined;
    if (ctrlData)
      inputValue = isNaN(+ctrlData.value) ? ctrlData.value : +ctrlData.value;

    const currentInputValue = ctrlData ? inputValue : defaultValue;
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].param = param;
        manClone[i].val = currentInputValue;
      }
    });
    cacheManifest(manClone);
  };

  return (
    <Layout>
      <div data-testid="controls-tab">
        <div
          className="top-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <AddCTRLBtn
            setCTRLSideBarStatus={setCtrlSidebarOpen}
            setIsEditMode={setIsEditMode}
            isCTRLSideBarOpen={ctrlSidebarOpen}
          />
          <EditSwitch />
        </div>
        <ControlGrid
          controlProps={{
            isEditMode,
            results: programResults,
            updateCtrlValue,
            attachParamsToCtrl,
            removeCtrl,
            setCurrentInput,
            setOpenEditModal,
          }}
        />
        <Sidebar
          sections={CTRL_TREE}
          manifestMap={CTRL_MANIFEST}
          leafNodeClickHandler={addCtrl}
          isSideBarOpen={ctrlSidebarOpen}
          setSideBarStatus={setCtrlSidebarOpen}
        />
      </div>
    </Layout>
  );
};

export default ControlsTab;
