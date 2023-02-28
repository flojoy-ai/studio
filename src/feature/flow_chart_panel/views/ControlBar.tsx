import { memo, useCallback, FC, useState, useEffect } from "react";
// import { useZoomPanHelper } from 'reactflow';
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

import "react-tabs/style/react-tabs.css";

import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
  cancelFlowChartRun,
} from "../../../services/FlowChartServices";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import ReactSwitch from "react-switch";
import PythonFuncModal from "./AddNodeModal";
import PlayIconSvg from "../../../utils/PlayIconSvg";
import { ControlsProps } from "../types/ControlsProps";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { useSocket } from "../../../hooks/useSocket";
import CancelIconSvg from "@src/utils/cancel_icon";

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
  const { states } = useSocket();
  const { socketId, setProgramResults, serverStatus } = states!;
  const [modalIsOpen, setIsOpen] = useState(false);

  const {
    isEditMode,
    setIsEditMode,
    rfInstance,
    openFileSelector,
    saveFile,
    setNodes,
  } = useFlowChartState();
  const onSave = async () => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      saveFlowChartToLocalStorage(rfInstance);
      setProgramResults({ io: [] });
      saveAndRunFlowChartInServer({ rfInstance, jobId: socketId });
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first."
      );
    }
  };

  const cancelFC = () => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      cancelFlowChartRun({ rfInstance, jobId: socketId });
    } else {
      alert(
        "There is no running job on server."
      );
    }
  }


  const onAdd: NodeOnAddFunc = useCallback(
    ({ key, params, type, inputs, customNodeId }) => {
      let functionName: string;
      const id = `${key}-${uuidv4()}`;
      if (key === "CONSTANT") {
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
              [key + "_" + functionName + "_" + param]: {
                functionName: key,
                param,
                value:
                  key === "CONSTANT" ? +functionName : params![param].default,
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: id,
        type: customNodeId || type,
        data: {
          id: id,
          label: functionName,
          func: key,
          type,
          ctrls: funcParams,
          inputs,
        },
        position: getNodePosition(),
      };
      setNodes((els) => els.concat(newNode));
      closeModal();
    },
    [setNodes]
  );

  const openModal = () => {
    setIsOpen(true);
  };
  const afterOpenModal = () => null;
  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  const isServerOffline = () =>
    serverStatus === "🛑 server offline" ||
    serverStatus === "Connecting to server...";

  return (
    <div className="save__controls">
      <button
        className={theme === "dark" ? "cmd-btn-dark" : "cmd-btn run-btn"}
        style={{
          color: theme === "dark" ? "#fff" : "#000",
          cursor: isServerOffline() ? "none" : "pointer",
        }}
        onClick={onSave}
        data-cy="btn-play"
        disabled={isServerOffline()}
      >
        <PlayIconSvg style={{ marginRight: "6px" }} theme={theme} /> Play
      </button>
      <button
        className={theme === "dark" ? "cmd-btn-dark" : "cmd-btn run-btn"}
        style={{
          color: 'red',
          display: 'flex',
          justifyContent:'center',
          alignItems:'center',
          gap:'3px',
          border: '1px solid rgb(255 153 177)',
          backgroundColor: 'rgb(255 158 153 / 20%)',
        }}
        onClick={cancelFC}
        data-cy="btn-cancel"
      >
        <CancelIconSvg style={{ marginRight: "6px" }} theme={theme} /> Cancel
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
    </div>
  );
};

export default memo(Controls);
