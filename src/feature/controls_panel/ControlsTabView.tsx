import clone from "just-clone";
import localforage from "localforage";
import { useCallback, useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";

import { modalStyles } from "./style/ControlModalStyles";
import "./style/Controls.css";

import ReactSwitch from "react-switch";
import "../../App.css";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "../../hooks/useFlowChartState";
import { saveAndRunFlowChartInServer } from "@src/services/FlowChartServices";
import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import { useSocket } from "@src/hooks/useSocket";
import { FUNCTION_PARAMETERS } from"@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { useControlsTabState } from "./ControlsTabState";
import AddCtrlModal from "./views/AddCtrlModal";
import ControlGrid from "./views/ControlGrid";
import { ControlNames } from "./manifest/CONTROLS_MANIFEST";
import { useControlsTabEffects } from "./ControlsTabEffects";
import { CtrlOptionValue } from "./types/ControlOptions";

localforage.config({ name: "react-flow", storeName: "flows" });

const ControlsTab = ({ results, theme, setOpenCtrlModal, openCtrlModal }) => {
  const { states } = useSocket();
  const { socketId, setProgramResults } = states!;

  console.log("CONTROLS TAB: ",results);

  const {
    openEditModal,
    setOpenEditModal,
    currentInput,
    setCurrentInput,
    debouncedTimerId,
    setDebouncedTimerId,
  } = useControlsTabState();

  const {
    rfInstance,
    elements,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    ctrlsManifest,
    setCtrlsManifest,
    isEditMode,
    gridLayout,
    setGridLayout,
  } = useFlowChartState();

  const afterOpenModal = () => null;
  const closeModal = () => {
    setOpenCtrlModal(false);
  };

 function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  const saveAndRunFlowChart = useCallback(() => {
    if (debouncedTimerId) {
      clearTimeout(debouncedTimerId);
    }
    const timerId = setTimeout(() => {
      setProgramResults({ io: [] });
      saveAndRunFlowChartInServer({ rfInstance, jobId: socketId });
    }, 3000);

    setDebouncedTimerId(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTimerId, rfInstance]);

  useControlsTabEffects(saveAndRunFlowChart);

  const addCtrl = (ctrlObj: Partial<CtlManifestType>) => {
    const ctrl: CtlManifestType = {
      ...ctrlObj,
      id: `ctrl-${uuidv4()}`,
      hidden: false,
    } as CtlManifestType;

    setOpenCtrlModal(false);

    let yAxis = 0;
    for (const el of gridLayout) {
      if (yAxis < el.y) {
        yAxis = el.y;
      }
    }

    setGridLayout([
      ...gridLayout,
      {
        x: 0,
        y: yAxis + 1,
        h: ctrl.minHeight > 2 ? ctrl.minHeight : 2,
        w: 2,
        i: ctrl.id,
        minH: ctrl.minHeight,
        minW: ctrl.minWidth,
        static: !isEditMode,
      },
    ]);

    cacheManifest([...ctrlsManifest, ctrl]);
  };

  const removeCtrl = (e: any, ctrl: any = undefined) => {
    const ctrlId = e.target.id;
    console.warn("Removing", ctrlId, ctrl);
    const filterChilds: any[] = ctrlsManifest.filter(
      (ctrl) => ctrl.id !== ctrlId
    );
    cacheManifest(filterChilds);

    if (ctrl.param) {
      removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
      saveAndRunFlowChart();
    }
  };

const updateCtrlValue = (val: string, ctrl: CtlManifestType) => {
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].val = val;
      }
    });
    cacheManifest(manClone);
    updateCtrlInputDataForNode(
      (ctrl.param! as CtrlManifestParam).nodeId,
      (ctrl.param! as CtrlManifestParam).id,
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
    // grab the current value for this param if it already exists in the flowchart elements
    const inputNode = elements.find((e) => e.id === param.nodeId);
    const ctrls = inputNode?.data?.ctrls;
    const fnParams = FUNCTION_PARAMETERS[param?.functionName] || {};

    // debugger
    const fnParam = fnParams[param?.param];
    const defaultValue =
      param.functionName === "CONSTANT"
        ? ctrl.val
        : fnParam?.default
        ? fnParam.default
        : 0;
    const ctrlData = ctrls && ctrls[param?.id];
    const currentInputValue = ctrlData ? ctrlData.value : defaultValue;
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
    <div data-testid="controls-tab">
      <ControlGrid
        controlProps={{
          theme,
          isEditMode,
          results,
          updateCtrlValue,
          attachParamsToCtrl,
          removeCtrl,
          setCurrentInput,
          setOpenEditModal,
        }}
      />

      <AddCtrlModal
        isOpen={openCtrlModal}
        afterOpenModal={afterOpenModal}
        closeModal={closeModal}
        addCtrl={addCtrl}
        theme={theme}
      />
      <Modal
        isOpen={openEditModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setOpenEditModal(false)}
        style={modalStyles}
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
        {currentInput && <div>
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
                checked={ctrlsManifest[currentInput?.index!]!?.hidden! || false}
                onChange={(nextChecked) => {
                  setCtrlsManifest((prev) => {
                    prev[currentInput?.index!].hidden = nextChecked;
                  });
                }}
              />
            </div>
            {ctrlsManifest[currentInput?.index!]?.name === ControlNames.SevenSegmentDisplay && (<div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <p>Segment Color </p>
              <input type="color" name="seven_segment_color" id="seven_segment_color" value={ctrlsManifest[currentInput.index].segmentColor || ''} onChange={e=> {
                setCtrlsManifest((prev) => {
                  prev[currentInput?.index!].segmentColor = e.target.value;
                });
                }} />
            </div>)}
          </div>
        </div>}
      </Modal>
    </div>
  );
};

export default ControlsTab;
