import { memo, FC, useState, useEffect } from "react";
import localforage from "localforage";
import "react-tabs/style/react-tabs.css";
import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
  cancelFlowChartRun,
} from "@src/services/FlowChartServices";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import ReactSwitch from "react-switch";
import { ControlsProps } from "../types/ControlsProps";
import { useSocket } from "@src/hooks/useSocket";
import CancelIconSvg from "@src/utils/cancel_icon";
import PlayBtn from "../components/play-btn/PlayBtn";
import { IServerStatus } from "@src/context/socket.context";
import DropDown from "@src/feature/common/dropdown/DropDown";
import KeyboardShortcutModal from "./KeyboardShortcutModal";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const Controls: FC<ControlsProps> = ({
  theme,
  activeTab,
  setOpenCtrlModal,
}) => {
  const { states } = useSocket();
  const { socketId, setProgramResults, serverStatus } = states!;
  const [isKeyboardShortcutOpen, setIskeyboardShortcutOpen] = useState(false);

  const { isEditMode, setIsEditMode, rfInstance, openFileSelector, saveFile } =
    useFlowChartState();
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
      {isEditMode && activeTab === "panel" && (
        <AddBtn
          testId={"add-ctrl"}
          theme={theme}
          handleClick={() => {
            setOpenCtrlModal((prev) => !prev);
          }}
        />
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
          <button data-cy="btn-save" onClick={saveFile}>
            Save
          </button>
          <button
            data-cy="btn-saveas"
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
    </div>
  );
};

export default memo(Controls);

const AddBtn = ({ handleClick, theme, testId }) => {
  return (
    <button
      data-cy={testId}
      data-testid={testId}
      className="save__controls_button btn__add"
      onClick={handleClick}
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
      >
        Add
      </div>
    </button>
  );
};
