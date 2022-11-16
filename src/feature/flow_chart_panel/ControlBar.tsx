import React, {
  memo,
  useCallback,
  Dispatch,
  FC,
  useState,
  useEffect,
} from "react";
import { useZoomPanHelper, OnLoadParams, Elements } from "react-flow-renderer";
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
type ParamTypes = {
  [x: string]: {
    type: string;
    options?: string[];
    default: number | string;
  };
};
export type NodeOnAddFunc = (props: {
  FUNCTION: string;
  type: string;
  params: ParamTypes | undefined;
  inputs?: Array<{name:string, id:string}> | undefined;
}) => void;

export type ElementsData = {
  label: string;
  func: string;
  type: string;
  running?: boolean;
  ctrls: {
    [key: string]: {
      functionName: string;
      param: string;
      value: number;
    };
  };
  inputs?: Array<{name:string; id:string}>
  selects?: any;
}


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
  theme: "light" | "dark";
  isVisualMode?: boolean;
  setOpenCtrlModal: Dispatch<React.SetStateAction<boolean>>;
};

const Controls: FC<ControlsProps> = ({
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

  const onAdd: NodeOnAddFunc = useCallback(
    ({ FUNCTION, params, type,inputs }) => {
      let functionName: string;
      if (FUNCTION === "CONSTANT") {
        let constant = prompt("Please enter a numerical constant", "2.0");
        if (constant == null) {
          constant = "2.0";
        }
        functionName = constant;
      } else {
        functionName = prompt("Please enter a name for this node")!;
      }
      if (!functionName) return;
      const funcParams = params
        ? Object.keys(params).reduce(
            (
              prev: Record<
                string,
                {
                  functionName: string;
                  param: keyof ParamTypes;
                  value: string | number;
                }
              >,
              param
            ) => ({
              ...prev,
              [FUNCTION + "_" + functionName + "_" + param.toUpperCase()]: {
                functionName: FUNCTION,
                param,
                value: params![param].default,
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: `${FUNCTION}-${uuidv4()}`,
        data: {
          label: functionName,
          func: FUNCTION,
          type,
          ctrls: funcParams,
          inputs
        },
        position: getNodePosition(),
      };
      setElements((els) => els.concat(newNode));
      closeModal();
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
      <button
        className={theme === "dark" ? "cmd-btn-dark" : "cmd-btn run-btn"}
        style={{
          color: theme === "dark" ? "#fff" : "#000",
        }}
        onClick={onSave}
      >
        <PlayIconSvg style={{ marginRight: "6px" }} theme={theme} /> Play
      </button>
      <button
        className="save__controls_button"
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
            fontSize: "20px",
          }}
        >
          +
        </div>
        <div
          style={{
            color: theme === "dark" ? "#fff" : "#000",
          }}
          data-cy={`add-${isVisualMode ? "node" : "ctrl"}`}
        >
          Add
        </div>
      </button>

      <button
        className="save__controls_button"
        style={{
          color: theme === "dark" ? "#fff" : "#000",
        }}
        onClick={openFileSelector}
      >
        Load
      </button>

      <button
        className="save__controls_button"
        style={{
          color: theme === "dark" ? "#fff" : "#000",
        }}
        onClick={saveFile}
      >
        Save
      </button>
      {!isVisualMode && (
        <div className="switch_container" style={{ paddingRight: "4px" }}>
          <span
            data-cy="operation-switch"
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
