import { CtlManifestType } from "@src/hooks/useFlowChartState";
import "react-grid-layout/css/styles.css";
import "../../../App.css";
import "../style/Controls.css";
import { ControlProps } from "../types/ControlProps";
import ControlComponent from "./ControlComponent";

export default function Control({
  controlProps,
  ctrl,
}: {
  controlProps: ControlProps;
  ctrl: CtlManifestType;
  ctrlIndex: number;
}) {
  const {
    isEditMode,
    theme,
    results,
    updateCtrlValue,
    attachParamsToCtrl,
    removeCtrl,
    setCurrentInput,
    setOpenEditModal,
  } = controlProps;

  return (
    <div
      className={isEditMode ? "ctrl-input" : ""}
      data-cy="ctrl-grid-item"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        backgroundColor: theme === "dark" ? "#14131361" : "#58454517",
      }}
    >
      {isEditMode ? (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParamsToCtrl={attachParamsToCtrl}
          removeCtrl={removeCtrl}
          setCurrentInput={setCurrentInput}
          setOpenEditModal={setOpenEditModal}
        />
      ) : ctrl.hidden ? null : (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParamsToCtrl={attachParamsToCtrl}
          removeCtrl={removeCtrl}
          setCurrentInput={setCurrentInput}
          setOpenEditModal={setOpenEditModal}
        />
      )}
    </div>
  );
}
