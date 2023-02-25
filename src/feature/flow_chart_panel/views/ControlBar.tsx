import { memo, useCallback, FC, useState, useEffect, useRef } from "react";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import "react-tabs/style/react-tabs.css";
import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
  cancelFlowChartRun,
} from "@src/services/FlowChartServices";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import ReactSwitch from "react-switch";
import PythonFuncModal from "./AddNodeModal";
import { ControlsProps } from "../types/ControlsProps";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { useSocket } from "@src/hooks/useSocket";
import CancelIconSvg from "@src/utils/cancel_icon";
import PlayBtn from "../components/play-btn/PlayBtn";
import { IServerStatus } from "@src/context/socket.context";
import DropDown from "@src/feature/common/dropdown/DropDown";

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
      alert("There is no running job on server.");
    }
  };

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

  const isPlayBtnDisabled = () =>
    serverStatus === IServerStatus.CONNECTING ||
    serverStatus === IServerStatus.OFFLINE;

  return (
    <div className="save__controls">
      {isPlayBtnDisabled() || serverStatus === IServerStatus.STANDBY ? (
        <PlayBtn
          onClick={onSave}
          disabled={isPlayBtnDisabled()}
          theme={theme}
        />
      ) : (
        <button
          className={`btn__cancel ${theme === "dark" ? "dark" : "light"}`}
          onClick={cancelFC}
          data-cy="btn-cancel"
          title="Cancel Run"
        >
          <CancelIconSvg theme={theme} />
          <span>Cancel</span>
        </button>
      )}
      {activeTab !== "debug" && activeTab === "visual" ? (
        <AddBtn
          handleClick={() => {
            openModal();
          }}
          theme={theme}
          dataCY={"add-node"}
        />
      ) : (
        isEditMode &&
        activeTab === "panel" && (
          <AddBtn
            dataCY={"add-ctrl"}
            theme={theme}
            handleClick={() => {
              setOpenCtrlModal((prev) => !prev);
            }}
          />
        )
      )}
      {activeTab !== "debug" && (
        <DropDown
          theme={theme}
          DropDownBtn={
            <button
              className="save__controls_button btn__file"
              style={{
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              <span>File</span>
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L5 6.74101L10 0H0Z"
                  fill={theme === "dark" ? "#fff" : "#000"}
                />
              </svg>
            </button>
          }
        >
          <button onClick={openFileSelector}>Load</button>
          <button onClick={saveFile}>Save</button>
          <button
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={saveFile}
          >
            <span>Save As</span>
            <small>Ctrl + s</small>
          </button>
          <button >History</button>
          <button >Keyboard Shortcut</button>
        </DropDown>
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
            onChange={() => setIsEditMode(!isEditMode)}
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

const AddBtn = ({ handleClick, theme, dataCY }) => {
  return (
    <button className="save__controls_button btn__add" onClick={handleClick}>
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
        data-cy={dataCY}
      >
        Add
      </div>
    </button>
  );
};
