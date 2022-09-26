import React, {
  memo,
  useCallback,
  Dispatch,
  FC,
  useState,
  useEffect,
} from "react";
import {
  useZoomPanHelper,
  OnLoadParams,
  Elements,
} from "react-flow-renderer";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

import "react-tabs/style/react-tabs.css";

import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
} from "../../services/FlowChartServices";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import ReactSwitch from "react-switch";
import PythonFuncModal from "./PythonFuncModal";
import PlayIconSvg from "../../utils/PlayIconSvg";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const getNodePosition = () => {
  return {
    x: 50 + Math.random() * 20,
    y: 50 + Math.random() + Math.random() * 20,
  };
};

type ControlsProps = {
  rfInstance?: OnLoadParams;
  setElements: Dispatch<React.SetStateAction<Elements<any>>>;
  clickedElement: Dispatch<React.SetStateAction<Elements<any>>>;
  onElementsRemove: Dispatch<React.SetStateAction<Elements<any>>>;
  theme: string;
  isVisualMode?: boolean;
  setOpenCtrlModal: Dispatch<React.SetStateAction<boolean>>;
};

const Controls: FC<ControlsProps> = ({
  clickedElement,
  onElementsRemove,
  theme,
  isVisualMode,
  setOpenCtrlModal,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { transform } = useZoomPanHelper();
  const {
    isEditMode,
    setIsEditMode,
    rfInstance,
    setElements,
    rfSpatialInfo,
    openFileSelector,
    saveFile,
  } = useFlowChartState();

  useEffect(() => {
    transform({
      x: rfSpatialInfo.x,
      y: rfSpatialInfo.y,
      zoom: rfSpatialInfo.zoom,
    });
  }, [rfSpatialInfo, transform]);

  const onSave = async () => {
    if (rfInstance && rfInstance.elements.length > 0) {
      saveFlowChartToLocalStorage(rfInstance);
      saveAndRunFlowChartInServer(rfInstance);
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first."
      );
    }
  };

  const onAdd = useCallback(
    (FUNCTION, TYPE) => {
      let functionName;
      if (FUNCTION === "CONSTANT") {
        let constant = prompt("Please enter a numerical constant", "2.0");
        if (constant == null) {
          constant = "2.0";
        }
        functionName = constant;
      } else {
        functionName = prompt('Please enter a name for this node')
      }
     if(!functionName) return;
      const newNode = {
        id: `${FUNCTION}-${uuidv4()}`,
        data: { label: functionName, func:FUNCTION, type: TYPE, ctrls: {} },
        position: getNodePosition(),
      };
      setElements((els) => els.concat(newNode));
      closeModal();

      // saveFlowChartToLocalStorage(rfInstance);
    },
    [setElements]
  );


  const openModal = () => {
    setIsOpen(true);
  };
  const afterOpenModal = () => {};
  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  return (
    <div className="save__controls">
      {/* {isVisualMode ? (
        <a onClick={openModal}>
          {" "}
          <span
            style={{
              color: theme === "dark" ? "#99F5FF" : "blue",
              marginRight: "5px",
              fontSize: "20px",
            }}
          >
            +
          </span>
        {windowWidth >= 1080 ?'Add Control' : 'Add'}
        </a>
      ) : (
      )} */}
      <button className={theme === 'dark' ? 'cmd-btn-dark':"cmd-btn run-btn"} onClick={onSave}>
        <PlayIconSvg style={{marginRight:'6px'}} theme={theme} /> Play
        {/* {windowWidth >=1080 ? 'Run Script':'Run'} */}
      </button>
      <button
        className="btn-noborder"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
        onClick={() => {
          if (isVisualMode) {
            openModal();
          } else {
            setOpenCtrlModal((prev) => !prev);
          }
        }}
      >
        {" "}
        <div
          style={{
            color: theme === "dark" ? "#99F5FF" : "blue",
            // marginRight: "5px",
            fontSize: "20px",
          }}
        >
          +
        </div>
        <div data-cy={`add-${isVisualMode ? 'node':'ctrl'}`}>Add</div>
        {/* {windowWidth >= 1080 ?'Add Python Function' : 'Add'} */}
      </button>

      <button className="btn-noborder" onClick={openFileSelector}>
        Load
        {/* {windowWidth >=1080 ?'Load File': 'Load'} */}
      </button>

      <button className="btn-noborder" onClick={saveFile}>
        Save
        {/* {windowWidth >=1080 ?'Save File':'Save'}  */}
      </button>
      {/* {isVisualMode && (
        <Select
          defaultValue={{ value: "edit", label: <EditLabel label={"Edit"} /> }}
          value={{ value: "edit", label: <EditLabel label={"Edit"} /> }}
          className="App-select"
          isSearchable={false}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          theme={theme as any}
        />
      )} */}
      {!isVisualMode && (
        <div className="switch_container" style={{ paddingRight: "4px" }}>
          <span
          data-cy='operation-switch' 
            style={{
              cursor: "pointer",
              fontSize: "14px",
              ...(isEditMode && { color: "orange" }),
            }}
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </span>
          <ReactSwitch
            checked={isEditMode}
            onChange={(nextChecked) => setIsEditMode(!isEditMode)}
            height={22}
            width={50}
          />
        </div>
      )}
      {/* <a onClick={() => setShowLogs((prev) => !prev)}>LOGS</a> */}

      <PythonFuncModal
        afterOpenModal={afterOpenModal}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        onAdd={onAdd}
        theme={theme}
      />
    </div>
  );
};

export default memo(Controls);
