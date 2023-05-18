import clone from "just-clone";
import localforage from "localforage";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import "./style/Controls.css";

import "@src/App.css";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { saveAndRunFlowChartInServer } from "@src/services/FlowChartServices";
import { useSocket } from "@src/hooks/useSocket";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { useControlsTabState } from "./ControlsTabState";
import ControlGrid from "./views/ControlGrid";
import { useControlsTabEffects } from "./ControlsTabEffects";
import { CtrlOptionValue } from "./types/ControlOptions";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { createStyles } from "@mantine/styles";
import { useMantineTheme } from "@mantine/styles";
import { AddCTRLBtn } from "@src/AddCTRLBtn";
import { EditSwitch } from "@src/EditSwitch";
import { CTRL_MANIFEST, CTRL_TREE } from "./manifest/CONTROLS_MANIFEST";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "@src/Layout";
import SidebarCustom from "../common/Sidebar/Sidebar";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";

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

const ControlsTab = () => {
  const [ctrlSidebarOpen, setCtrlSidebarOpen] = useState(false);

  const theme = useMantineTheme();
  const { states } = useSocket();
  const { socketId, setProgramResults, programResults } = states!;
  const results = programResults!;

  const {
    setOpenEditModal,
    setCurrentInput,
    debouncedTimerId,
    setDebouncedTimerId,
  } = useControlsTabState();

  const {
    rfInstance,
    ctrlsManifest,
    setCtrlsManifest,
    isEditMode,
    setIsEditMode,
    gridLayout,
  } = useFlowChartState();

  const { nodes, updateCtrlInputDataForNode, removeCtrlInputDataForNode } =
    useFlowChartGraph();

  function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  // const saveAndRunFlowChart = useCallback(() => {
  //   if (debouncedTimerId) {
  //     clearTimeout(debouncedTimerId);
  //   }
  //   const timerId = setTimeout(() => {
  //     setProgramResults({ io: [] });
  //     saveAndRunFlowChartInServer(socketId, rfInstance);
  //   }, 3000);

  //   setDebouncedTimerId(timerId);
  // }, [debouncedTimerId, rfInstance]);

  useControlsTabEffects();

  //function for handling a CTRL add (assume that input is key from manifest)
  const addCtrl = (ctrlKey: string) => {
    setCtrlSidebarOpen(false); //close the sidebar when adding a ctrl
    const ctrlObj = CTRL_MANIFEST[ctrlKey].find((c) => c.key === ctrlKey);
    if (!ctrlObj) {
      console.error("Could not find ctrl object for key", ctrlKey);
      return;
    }

    const id = `ctrl-${uuidv4()}`;
    let yAxis = 0;
    for (const el of gridLayout) {
      if (yAxis < el.y) {
        yAxis = el.y;
      }
    }
    const ctrlLayout = {
      x: 0,
      y: yAxis + 1,
      h: ctrlObj.minHeight! > 2 ? ctrlObj.minHeight : 2,
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
  };

  const removeCtrl = (e: any, ctrl: any = undefined) => {
    const ctrlId = e.target.id;
    console.warn("Removing", ctrlId, ctrl);
    const filterChilds = ctrlsManifest.filter((ctrl) => ctrl.id !== ctrlId);
    cacheManifest(filterChilds);

    // if (ctrl.param) {
    //   removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
    //   saveAndRunFlowChart();
    // }
  };

  const updateCtrlValue = (val: string, ctrl: CtlManifestType) => {
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      // if (c.id === ctrl.id) {
      //   manClone[i].val = isNaN(+val) ? val : +val;
      // }
    });
    cacheManifest(manClone);
    updateCtrlInputDataForNode(
      (ctrl.param! as CtrlManifestParam).nodeId,
      (ctrl.param! as CtrlManifestParam).param,
      {
        functionName: (ctrl.param! as CtrlManifestParam).functionName,
        param: (ctrl.param! as CtrlManifestParam).param,
        value: val,
      }
    );
  };

  const attachParamsToCtrl = (
    param: CtrlOptionValue,
    ctrl: CtlManifestType
  ) => {
    // grab the current value for this param if it already exists in the flowchart nodes
    const inputNode = nodes.find((e) => e.id === param.nodeId);
    const ctrls = inputNode?.data?.ctrls;
    const fnParams = FUNCTION_PARAMETERS[param.functionName];
    // debugger
    const fnParam = fnParams[param?.param];
    const defaultValue =
      param.functionName === "CONSTANT"
        ? ctrl.val
        : fnParam?.default
        ? fnParam.default
        : 0;
    const ctrlData = ctrls && ctrls[param.param];

    const inputValue = ctrlData !== undefined ? +ctrlData.value : undefined;
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
          <EditSwitch isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        </div>
        <ControlGrid
          controlProps={{
            isEditMode,
            results,
            updateCtrlValue,
            attachParamsToCtrl,
            removeCtrl,
            setCurrentInput,
            setOpenEditModal,
          }}
        />
        <SidebarCustom
          sections={CTRL_TREE}
          manifestMap={CTRL_MANIFEST}
          leafNodeClickHandler={addCtrl}
          isSideBarOpen={ctrlSidebarOpen}
          setSideBarStatus={setCtrlSidebarOpen}
        />

        {/* <AddCtrlModal
        isOpen={openCtrlModal}
        afterOpenModal={afterOpenModal}
        closeModal={closeModal}
        addCtrl={addCtrl}
        theme={theme}
      /> */}
        {/* <Modal
        isOpen={openEditModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setOpenEditModal(false)}
        style={modalStyles(theme)}
        ariaHideApp={false}
        contentLabel="Choose a Python function"
      >
        <button onClick={() => setOpenEditModal(false)} className="close-modal">
          <ModalCloseSvg
            style={{
              height: 23,
              width: 23,
            }}
          />
        </button>
        {currentInput && (
          <div>
            <p>Ctrl properties</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <p>Hidden</p>
                <ReactSwitch
                  checked={
                    ctrlsManifest[currentInput?.index!]!?.hidden! || false
                  }
                  onChange={(nextChecked) => {
                    setCtrlsManifest((prev) => {
                      prev[currentInput?.index!].hidden = nextChecked;
                    });
                  }}
                />
              </div>
              {ctrlsManifest[currentInput?.index!]?.name ===
                ControlNames.SevenSegmentDisplay && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <p>Segment Color </p>
                  <input
                    type="color"
                    name="seven_segment_color"
                    id="seven_segment_color"
                    value={ctrlsManifest[currentInput.index].segmentColor || ""}
                    onChange={(e) => {
                      setCtrlsManifest((prev) => {
                        prev[currentInput?.index!].segmentColor =
                          e.target.value;
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal> */}
      </div>
    </Layout>
  );
};

export default ControlsTab;
