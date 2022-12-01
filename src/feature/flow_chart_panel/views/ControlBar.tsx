import { memo, useCallback, FC, useState, useEffect } from "react";
import { useZoomPanHelper } from "react-flow-renderer";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

import "react-tabs/style/react-tabs.css";

import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
} from "../../../services/FlowChartServices";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import ReactSwitch from "react-switch";
import PythonFuncModal from "./PythonFuncModal";
import PlayIconSvg from "../../../utils/PlayIconSvg";
import { ControlsProps } from "../types/ControlsProps";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { useSocket } from "@hooks/useSocket";

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


const Controls: FC<ControlsProps> = ({
  theme,
  activeTab,
  setOpenCtrlModal,
}) => {
  const {states:{socketId}} = useSocket();
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

  const onSave = async () => {
    if (rfInstance && rfInstance.elements.length > 0) {
      saveFlowChartToLocalStorage(rfInstance);
      saveAndRunFlowChartInServer({rfInstance, jobId: socketId});
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first."
      );
    }
  };

  const onAdd: NodeOnAddFunc = useCallback(
    ({ FUNCTION, params, type,  inputs }) => {
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
          inputs,
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
    transform({
      x: rfSpatialInfo.x,
      y: rfSpatialInfo.y,
      zoom: rfSpatialInfo.zoom,
    });
  }, [rfSpatialInfo, transform]);

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
      {activeTab !== "debug" && activeTab === "visual" ? (
        <button
          className="save__controls_button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
          onClick={() => {
            openModal();
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
            data-cy={`add-node`}
          >
            Add
          </div>
        </button>
      ) : (
        isEditMode &&
        activeTab === "panel" && (
          <button
            className="save__controls_button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
            onClick={() => {
              setOpenCtrlModal((prev) => !prev);
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
              data-cy={`add-ctrl`}
            >
              Add
            </div>
          </button>
        )
      )}

      {activeTab !== "debug" && (
        <button
          className="save__controls_button"
          style={{
            color: theme === "dark" ? "#fff" : "#000",
          }}
          onClick={openFileSelector}
        >
          Load
        </button>
      )}

      {activeTab !== "debug" && (
        <button
          className="save__controls_button"
          style={{
            color: theme === "dark" ? "#fff" : "#000",
          }}
          onClick={saveFile}
        >
          Save
        </button>
      )}
      {activeTab !== "visual" && activeTab !== "debug" && (
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
