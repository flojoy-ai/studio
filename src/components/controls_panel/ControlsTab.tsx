import React, { useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import {
  OutputControlsManifest,
  InputControlsManifest,
  ControlTypes,
  ControlNames,
} from "./CONTROLS_MANIFEST";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ControlComponent from "./controlComponent";
import clone from "just-clone";
import localforage from "localforage";

import "./Controls.css";
import "../../App.css";
import {
  CtlManifestType,
  useFlowChartState,
} from "../../hooks/useFlowChartState";
import { saveAndRunFlowChartInServer } from "../../services/FlowChartServices";
import { FUNCTION_PARAMETERS } from "../flow_chart_panel/PARAMETERS_MANIFEST";
import ReactSwitch from "react-switch";
import Select from "react-select";
import customDropdownStyles from "./customDropdownStyles";
import { InputActionMeta } from "react-select";
import ControlGrid from "./ControlGrid";
import SampleRGL from "./SampleRGL";

localforage.config({ name: "react-flow", storeName: "flows" });

const ControlsTab = ({ results, theme }) => {
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const [openEditModal, setOPenEditModal] = useState(false);
  const [currentInput, setCurrentInput] = useState<
    CtlManifestType & { index: number }
  >();

  const {
    rfInstance,
    elements,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    ctrlsManifest,
    setCtrlsManifest,
  } = useFlowChartState();
  const [debouncedTimerId, setDebouncedTimerId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const { isEditMode, setIsEditMode, gridLayout, setGridLayout } =
    useFlowChartState();

  const modalStyles = { overlay: { zIndex: 99 }, content: { zIndex: 100 } };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const afterOpenModal = () => {};
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveAndRunFlowChart = () => {
    // save and run the script with debouncing
    if (debouncedTimerId) {
      clearTimeout(debouncedTimerId);
    }
    const timerId = setTimeout(() => {
      saveAndRunFlowChartInServer(rfInstance);
    }, 1000);

    setDebouncedTimerId(timerId);
  };

  async function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  const addCtrl = (ctrlObj: Partial<CtlManifestType>) => {
    const ctrl: CtlManifestType = {
      ...ctrlObj,
      id: `ctrl-${uuidv4()}`,
      hidden: false,
      ...(ctrlObj.name === ControlNames.Control_Group && {
        label:
          "control-group " +
          (ctrlsManifest.filter((c) => c.name === ControlNames.Control_Group)
            .length +
            1),
      }),
    } as CtlManifestType;
    console.log("adding ctrl...", ctrl);
    console.log(ctrl.type, ctrl.type === "input");
    setIsModalOpen(false);
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
        h: 2,
        w: 2,
        i: ctrl.id,
        minH: ctrl.minHeight,
        minW: ctrl.minWidth,
        static: !isEditMode
      },
    ]);
    cacheManifest([...ctrlsManifest, ctrl]);
  };

  const rmCtrl = (e, ctrl: any = undefined) => {
    const ctrlId = e.target.id;
    console.warn("Removing", ctrlId, ctrl);
    const filteredOutputs = ctrlsManifest.filter((ctrl) => ctrl.id !== ctrlId);
    let filterChilds: any[] = filteredOutputs;
    if (ctrl.name === ControlNames.Control_Group) {
      filterChilds = filteredOutputs.filter((c) => c.controlGroup !== ctrl.id);
    }
    cacheManifest(filterChilds);
    if (ctrl) {
      removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
      saveAndRunFlowChart();
    }
  };

  const updateCtrlValue = (val, ctrl) => {
    console.log("updateCtrlValue:", val, ctrl);
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
    saveAndRunFlowChart();
  };

  const attachParam2Ctrl = (param, ctrl) => {
    console.log("attachParam2Ctrl", param, ctrl);

    // grab the current value for this param if it already exists in the flowchart elements
    const inputNode = elements.find((e) => e.id === param.nodeId);
    const ctrls = inputNode?.data?.ctrls;
    const fnParams = FUNCTION_PARAMETERS[param?.functionName] || {};
    // debugger
    const fnParam = fnParams[param?.param];
    const defaultValue = fnParam?.default || 0;
    console.log("attachParam2Ctrl defaultValue:", defaultValue);
    const ctrlData = ctrls && ctrls[param?.id];
    console.log("attachParam2Ctrl ctrlData:", ctrlData);
    let currentInputValue = ctrlData ? ctrlData.value : defaultValue;

    let manClone = clone(ctrlsManifest);
    manClone.map((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].param = param;
        manClone[i].val = currentInputValue;
      }
    });
    cacheManifest(manClone);
  };

  return (
    <div>
      <div className="save__controls">
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <a onClick={openModal}>🎚️ Add Control</a>
          <div className="switch_container">
            <span
              style={{
                cursor: "pointer",
                ...(isEditMode && { color: "orange" }),
              }}
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </span>
            <ReactSwitch
              checked={isEditMode}
              onChange={(nextChecked) => setIsEditMode(!isEditMode)}
            />
          </div>
        </div>
      </div>
      {/* <SampleRGL/> */}

      <ControlGrid
        controlProps={{
          theme,
          isEditMode,
          results,
          updateCtrlValue,
          attachParam2Ctrl,
          rmCtrl,
          setCurrentInput,
          setOPenEditModal,
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
                    {/* <div className="ctrl-header">
                {isEditMode && (
                  <>
                  <button className="ctrl-edit-btn" onClick={()=> {
                      setCurrentInput({...ctrl, index:ctrlsManifest.findIndex(manifest=> manifest.id === ctrl.id )});
                      setOPenEditModal(true)}}>&#9998;</button>
                    
                  <button
                    onClick={(e) => rmCtrl(e, ctrl)}
                    id={ctrl.id}
                    className='ctrl-edit-btn'
                  >
                    x
                  </button>
                  </>
                )}
                </div> */}
                    {isEditMode ? (
                      <ControlComponent
                        ctrlObj={ctrl}
                        theme={theme}
                        results={results}
                        updateCtrlValue={updateCtrlValue}
                        attachParam2Ctrl={attachParam2Ctrl}
                        rmCtrl={rmCtrl}
                        setCurrentInput={setCurrentInput}
                        setOPenEditModal={setOPenEditModal}
                      />
                    ) : ctrl.hidden ? null : (
                      <ControlComponent
                        ctrlObj={ctrl}
                        theme={theme}
                        results={results}
                        updateCtrlValue={updateCtrlValue}
                        attachParam2Ctrl={attachParam2Ctrl}
                        rmCtrl={rmCtrl}
                        setCurrentInput={setCurrentInput}
                        setOPenEditModal={setOPenEditModal}
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
                      {/* <div className="ctrl-header">

                  {isEditMode && (
                    <>
                    <button className="ctrl-edit-btn" onClick={()=> {
                      setCurrentInput({...ctrl, index: ctrlsManifest.findIndex(manifest=> manifest.id === ctrl.id )});
                      setOPenEditModal(true)}}>&#9998;</button>
                    <button
                      onClick={(e) => rmCtrl(e)}
                      id={ctrl.id}
                      className='ctrl-edit-btn'
                    >
                      x
                    </button>
                    </>
                  )}
                </div> */}
                      <ControlComponent
                        ctrlObj={ctrl}
                        results={results}
                        theme={theme}
                        updateCtrlValue={updateCtrlValue}
                        attachParam2Ctrl={attachParam2Ctrl}
                        rmCtrl={rmCtrl}
                        setCurrentInput={setCurrentInput}
                        setOPenEditModal={setOPenEditModal}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel="Choose a Python function"
      >
        <button onClick={closeModal} className="ctrl-close-btn">
          x
        </button>
        <Tabs>
          <TabList>
            <Tab>Inputs</Tab>
            <Tab>Outputs</Tab>
          </TabList>

          <TabPanel key={0}>
            <div className="ctrl-picker-container">
              {InputControlsManifest.map((ctrl, ctrlIndex) => (
                <span key={ctrlIndex}>
                  <button
                    onClick={() =>
                      addCtrl({
                        type: ctrl.type,
                        name: ctrl.name,
                        minWidth: ctrl.minWidth,
                        minHeight: ctrl.minHeight,
                      })
                    }
                  >
                    {ctrl.name}
                  </button>
                </span>
              ))}
            </div>
          </TabPanel>

          <TabPanel key={1}>
            <div className="ctrl-picker-container">
              {OutputControlsManifest.map((ctrl, ctrlIndex) => (
                <span key={ctrlIndex}>
                  <button
                    onClick={() =>
                      addCtrl({
                        type: ctrl.type,
                        name: ctrl.name,
                      })
                    }
                  >
                    {ctrl.name}
                  </button>
                </span>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </Modal>
      <Modal
        isOpen={openEditModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setOPenEditModal(false)}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel="Choose a Python function"
      >
        <button
          onClick={() => setOPenEditModal(false)}
          className="ctrl-close-btn"
        >
          x
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
            {currentInput?.name === ControlNames.Control_Group && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <p>Label</p>
                <input
                  value={ctrlsManifest[currentInput?.index!]!?.label}
                  onChange={(e) => {
                    setCtrlsManifest((prev) => {
                      prev[
                        prev.findIndex((ctrl) => ctrl.id === currentInput?.id)
                      ].label = e.target.value;
                    });
                  }}
                />
              </div>
            )}
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
            {currentInput?.name !== ControlNames.Control_Group && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <p>Ctrl group: </p>
                <div style={{ width: "250px" }}>
                  <Select
                    className="select-node"
                    isSearchable={true}
                    onChange={(val: any) => {
                      // console.log(val, 'select onchange val')
                      // attachParam2Ctrl(val.id, ctrlsManifest);
                      setCtrlsManifest((prev) => {
                        prev[currentInput?.index!].controlGroup = val.id;
                      });
                    }}
                    options={ctrlsManifest.filter(
                      (ctrl) => ctrl.name === ControlNames.Control_Group
                    )} // {options}
                    styles={customDropdownStyles}
                    formatOptionLabel={(data: CtlManifestType) => data.label}
                    theme={theme}
                    value={
                      ctrlsManifest.find(
                        (ctrl) =>
                          ctrl.id ===
                          ctrlsManifest[currentInput?.index!]?.controlGroup
                      )! || ""
                    }
                    isDisabled={!isEditMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ControlsTab;
