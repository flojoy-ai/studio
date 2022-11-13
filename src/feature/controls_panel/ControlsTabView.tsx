import { useCallback } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import ControlComponent from "./views/controlComponent";
import clone from "just-clone";
import localforage from "localforage";

import "./style/Controls.css";
import { modalStyles } from "./style/ControlModalStyles"

import "../../App.css";
import {
  CtlManifestType,
  useFlowChartState,
} from "../../hooks/useFlowChartState";
import { saveAndRunFlowChartInServer } from "../../services/FlowChartServices";
import { FUNCTION_PARAMETERS } from "../flow_chart_panel/PARAMETERS_MANIFEST";
import ReactSwitch from "react-switch";
import ControlGrid from "./views/ControlGrid";
import AddCtrlModal from "./views/AddCtrlModal";
import ModalCloseSvg from "../../utils/ModalCloseSvg";
import { useControlsTabState } from "./ControlsTabState";
import { useControlsTabEffects } from "./ControlsTabEffects";

localforage.config({ name: "react-flow", storeName: "flows" });

const ControlsTab = ({ results, theme, setOpenCtrlModal, openCtrlModal }) => {
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

  const afterOpenModal = () => {};
  const closeModal = () => {
    setOpenCtrlModal(false);
  };

  const saveAndRunFlowChart = useCallback(() => {
    // save and run the script with debouncing
    if (debouncedTimerId) {
      clearTimeout(debouncedTimerId);
    }
    const timerId = setTimeout(() => {
      saveAndRunFlowChartInServer(rfInstance);
    }, 700);

    setDebouncedTimerId(timerId);
  }, [debouncedTimerId, setDebouncedTimerId, rfInstance]);

  async function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  const addCtrl = (setOpenCtrlModal, ctrlObj: Partial<CtlManifestType>) => {
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
    const filteredOutputs = ctrlsManifest.filter((ctrl) => ctrl.id !== ctrlId);
    let filterChilds: any[] = filteredOutputs;
    cacheManifest(filterChilds);

    if (ctrl) {
      removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
      saveAndRunFlowChart();
    }
  };

  const updateCtrlValue = (val: any, ctrl: any) => {
    let manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].val = val;
      }
    });
    cacheManifest(manClone);
    updateCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id, {
      functionName: ctrl.param.functionName,
      param: ctrl.param.param,
      value: val,
    });
  };

  const attachParamsToCtrl = (
    param: {
      id: string;
      functionName: string;
      param: string;
      nodeId: string;
      inputId: string;
    },
    ctrl: any
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
    let currentInputValue = ctrlData ? ctrlData.value : defaultValue;
    let manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].param = param;
        manClone[i].val = currentInputValue;
      }
    });
    cacheManifest(manClone);
  };

  useControlsTabEffects();

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

      {false && (
        <>
          <div className="App-controls-header">
            <div className="input-header">Inputs</div>
            <div className="output-header">Outputs</div>
          </div>

          <div className="App-controls-panel">
            <div className="ctrl-inputs-sidebar">
              <div className="ctrl-input-group"></div>
              {ctrlsManifest
                .filter((c) => c.type === "input" && !c.controlGroup)
                .map((ctrl, i) => (
                  <div key={ctrl.id} className={isEditMode ? "ctrl-input" : ""}>
                    {isEditMode ? (
                      <ControlComponent
                        ctrlObj={ctrl}
                        theme={theme}
                        results={results}
                        updateCtrlValue={updateCtrlValue}
                        attachParamsToCtrl={attachParamsToCtrl}
                        removeCtrl={removeCtrl}
                        setCurrentInput={setCurrentInput}
                        setOpenEditModal={setOpenEditModal}
                      />
                    ) : ctrl.hidden ? null : (
                      <ControlComponent
                        ctrlObj={ctrl}
                        theme={theme}
                        results={results}
                        updateCtrlValue={updateCtrlValue}
                        attachParamsToCtrl={attachParamsToCtrl}
                        removeCtrl={removeCtrl}
                        setCurrentInput={setCurrentInput}
                        setOpenEditModal={setOpenEditModal}
                      />
                    )}
                  </div>
                ))}
              <div
                className="ctrl-input"
                style={{ overflow: "scroll", height: 300 }}
              >
                <pre>{JSON.stringify(ctrlsManifest, undefined, 2)}</pre>
              </div>
            </div>
            <div className="ctrl-outputs-container">
              <div className="ctrl-outputs-canvas">
                {ctrlsManifest
                  .filter((c) => c.type === "output")
                  .map((ctrl, i) => (
                    <div
                      key={ctrl.id}
                      className={isEditMode ? "ctrl-output" : ""}
                      style={{ margin: "20px 0 0 20px" }}
                    >
                      <ControlComponent
                        ctrlObj={ctrl}
                        results={results}
                        theme={theme}
                        updateCtrlValue={updateCtrlValue}
                        attachParamsToCtrl={attachParamsToCtrl}
                        removeCtrl={removeCtrl}
                        setCurrentInput={setCurrentInput}
                        setOpenEditModal={setOpenEditModal}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

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
                checked={ctrlsManifest[currentInput?.index!]!?.hidden! || false}
                onChange={(nextChecked) => {
                  console.log(nextChecked, " next");
                  setCtrlsManifest((prev) => {
                    prev[currentInput?.index!].hidden = nextChecked;
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ControlsTab;
