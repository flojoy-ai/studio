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
import PlayIconSvg from "../../../utils/PlayIconSvg";
import { ControlsProps } from "../types/ControlsProps";
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

  const isServerOffline = () => {
    return (
      serverStatus === "🛑 server offline" ||
      serverStatus === "Connecting to server..."
    );
  };

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
          color: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "3px",
          border: "1px solid rgb(255 153 177)",
          backgroundColor: "rgb(255 158 153 / 20%)",
        }}
        onClick={cancelFC}
        data-cy="btn-cancel"
      >
        <CancelIconSvg style={{ marginRight: "6px" }} theme={theme} /> Cancel
      </button>
      {isEditMode && activeTab === "panel" && (
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
