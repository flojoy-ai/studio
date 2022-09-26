import React, {
  Component,
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
  FlowExportObject,
} from "react-flow-renderer";
import localforage from "localforage";
import Modal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

import "react-tabs/style/react-tabs.css";
import { COMMANDS, SECTIONS } from "./COMMANDS_MANIFEST.js";

import { lightTheme, darkTheme } from "./../theme";
import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
} from "../../services/FlowChartServices";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { useWindowSize } from "react-use";
import ReactSwitch from "react-switch";
import ModalCloseSvg from "../../utils/ModalCloseSvg";
import PythonFuncModal from "./PythonFuncModal";
import PlayIconSvg from "../../utils/PlayIconSvg";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const flowKey = "flow-joy";

const getNodePosition = () => {
  return {
    x: 50 + Math.random() * 20,
    y: 50 + Math.random() + Math.random() * 20,
  };
};

const EditLabel = ({ Svg, label }: { Svg?: any; label: string }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {Svg ? (
        <Svg />
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 11 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.96 6.63995H7.05C6.79 5.62995 5.75 5.01995 4.74 5.27995C3.73 5.53995 3.12 6.57995 3.38 7.58995C3.64 8.59995 4.68 9.20995 5.69 8.94995C6.36 8.77995 6.88 8.25995 7.05 7.58995H9.96C10.22 7.58995 10.43 7.37995 10.43 7.11995C10.43 6.85995 10.22 6.64995 9.96 6.64995V6.63995ZM5.22 8.05995C4.7 8.05995 4.27 7.63995 4.27 7.10995C4.27 6.57995 4.69 6.15995 5.22 6.15995C5.75 6.15995 6.17 6.57995 6.17 7.10995C6.17 7.63995 5.75 8.05995 5.22 8.05995ZM0 7.10995C0 6.84995 0.21 6.63995 0.47 6.63995H1.89C2.15 6.63995 2.36 6.84995 2.36 7.10995C2.36 7.36995 2.15 7.57995 1.89 7.57995H0.47C0.21 7.57995 0 7.36995 0 7.10995ZM0 1.88995C0 1.62995 0.21 1.41995 0.47 1.41995H3.79C4.05 1.41995 4.26 1.62995 4.26 1.88995C4.26 2.14995 4.05 2.35995 3.79 2.35995H0.47C0.21 2.35995 0 2.14995 0 1.88995ZM9.96 1.41995H8.94C8.68 0.409947 7.64 -0.200053 6.63 0.0599474C5.62 0.319947 5.01 1.35995 5.27 2.36995C5.53 3.37995 6.57 3.98995 7.58 3.72995C8.25 3.55995 8.77 3.03995 8.94 2.36995H9.96C10.22 2.36995 10.43 2.15995 10.43 1.89995C10.43 1.63995 10.22 1.42995 9.96 1.42995V1.41995ZM7.11 2.83995C6.59 2.83995 6.16 2.41995 6.16 1.88995C6.16 1.35995 6.58 0.939947 7.11 0.939947C7.64 0.939947 8.06 1.35995 8.06 1.88995C8.06 2.41995 7.64 2.83995 7.11 2.83995Z"
            fill="#7B61FF"
          />
        </svg>
      )}
      <div>{label}</div>
    </div>
  );
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
    setShowLogs,
    isEditMode,
    setIsEditMode,
    rfInstance,
    setElements,
    rfSpatialInfo,
    openFileSelector,
    saveFile,
    loadFlowExportObject,
  } = useFlowChartState();
  const { width: windowWidth } = useWindowSize();
  let fileReader;

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

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow: FlowExportObject | null = await localforage.getItem(flowKey);

      if (flow) {
        loadFlowExportObject(flow);
      }
    };

    restoreFlow();

    saveFlowChartToLocalStorage(rfInstance);
  }, [loadFlowExportObject, rfInstance]);

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
    [setElements, rfInstance]
  );

  const onClickElementDelete = () => {
    console.warn("onClickElementDelete", clickedElement);
    if (rfInstance && clickedElement) {
      console.warn("ELEM TO REMOVE", clickedElement);
      onElementsRemove([clickedElement] as any);
      saveFlowChartToLocalStorage(rfInstance);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const afterOpenModal = () => {};
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (selectedOption) => {
    console.warn(selectedOption);
    if (selectedOption.value === "delete") {
      onClickElementDelete();
    } else if (selectedOption.value === "undo") {
      onRestore();
    }
  };

  const options: { value: string; label: any }[] = [
    { value: "delete", label: <EditLabel label="Delete" /> },
    { value: "undo", label: <EditLabel label="Undo" /> },
  ];

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor:
        state.selectProps.theme === "dark"
          ? darkTheme.background
          : lightTheme.background,
      color:
        state.selectProps.theme === "dark" ? darkTheme.text : lightTheme.text,
    }),

    control: (provided, state) => ({
      ...provided,
      backgroundColor:
        state.selectProps.theme === "dark"
          ? darkTheme.background
          : lightTheme.background,
      color:
        state.selectProps.theme === "dark" ? darkTheme.text : lightTheme.text,
    }),

    option: (styles, { selectProps, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: isSelected
          ? selectProps.theme === "dark"
            ? "black"
            : "#eee"
          : isFocused
          ? selectProps.theme === "dark"
            ? "black"
            : "#eee"
          : undefined,
        ":active": {
          ...styles[":active"],
          backgroundColor: theme === "dark" ? "black" : "#eee",
        },
      };
    },

    singleValue: (provided, state) => {
      const color =
        state.selectProps.theme === "dark" ? darkTheme.text : lightTheme.text;

      return { ...provided, color, fontSize: "16px" };
    },
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
      <a
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
      </a>

   

      <a data-cy='load' onClick={openFileSelector}>
        Load
        {/* {windowWidth >=1080 ?'Load File': 'Load'} */}
      </a>

      <a onClick={saveFile}>
        Save
        {/* {windowWidth >=1080 ?'Save File':'Save'}  */}
      </a>
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
