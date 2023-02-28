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
import AddNodeModal from "./AddNodeModal";
import { ControlsProps } from "../types/ControlsProps";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { useSocket } from "@src/hooks/useSocket";
import CancelIconSvg from "@src/utils/cancel_icon";
import PlayBtn from "../components/play-btn/PlayBtn";
import { IServerStatus } from "@src/context/socket.context";
import DropDown from "@src/feature/common/dropdown/DropDown";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { ElementsData } from "../types/CustomNodeProps";

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
  const [isKeyboardShortcutOpen, setIskeyboardShortcutOpen] = useState(false);

  const {
    isEditMode,
    setIsEditMode,
    rfInstance,
    openFileSelector,
    saveFile,
    nodes,
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

  const addNewNode: NodeOnAddFunc = useCallback(
    ({ funcName, params, type, inputs, uiComponentId }) => {
      let nodeLabel: string;
      const nodeId = `${funcName}-${uuidv4()}`;
      if (funcName === "CONSTANT") {
        nodeLabel = "2.0";
      } else {
        const numOfThisNodesOnChart = nodes.filter(
          (node) => node.data.func === funcName
        ).length;
        nodeLabel = numOfThisNodesOnChart > 0 ? `${funcName}_${numOfThisNodesOnChart}` : funcName;
      }
      const nodeParams = params
        ? Object.keys(params).reduce(
            (prev: ElementsData["ctrls"], param) => ({
              ...prev,
              [param]: {
                functionName: funcName,
                param,
                value:
                  funcName === "CONSTANT"
                    ? nodeLabel
                    : params![param].default?.toString(),
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: nodeId,
        type: uiComponentId || type,
        data: {
          id: nodeId,
          label: nodeLabel,
          func: funcName,
          type,
          ctrls: nodeParams,
          inputs,
        },
        position: getNodePosition(),
      };
      setNodes((els) => els.concat(newNode));
      closeModal();
    },
    [nodes,setNodes]
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
          testId={"add-node"}
        />
      ) : (
        isEditMode &&
        activeTab === "panel" && (
          <AddBtn
            testId={"add-ctrl"}
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
          <button>History</button>
          <button onClick={() => setIskeyboardShortcutOpen(true)}>
            Keyboard Shortcut
          </button>
        </DropDown>
      )}
      {activeTab !== "visual" && activeTab !== "debug" && (
        <div className="switch_container" style={{ paddingRight: "4px" }}>
          <span
            data-cy="operation-switch"
            data-testid="operation-switch"
            style={{
              cursor: "pointer",
              fontSize: "14px",
              ...(isEditMode
                ? { color: "orange" }
                : {
                    color: theme === "dark" ? "#fff" : "#000",
                  }),
            }}
            onClick={() => setIsEditMode(!isEditMode)}
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

      <KeyboardShortcutModal
        isOpen={isKeyboardShortcutOpen}
        onClose={() => setIskeyboardShortcutOpen(false)}
        theme={theme}
      />

      <AddNodeModal
        afterOpenModal={afterOpenModal}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        onAdd={addNewNode}
        theme={theme}
      />
    </div>
  );
};

export default memo(Controls);

const AddBtn = ({ handleClick, theme, testId, }) => {
  return (
    <button
    data-cy={testId}
    data-testid={testId}
    className="save__controls_button btn__add" onClick={handleClick}>
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

      >
        Add
      </div>
    </button>
  );
};
