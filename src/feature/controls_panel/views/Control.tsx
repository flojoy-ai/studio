import { CtlManifestType } from "@src/hooks/useFlowChartState";
import "react-grid-layout/css/styles.css";
import "@src/App.css";
import "../style/Controls.css";
import { ControlProps } from "../types/ControlProps";
import ControlComponent from "./control-component/ControlComponent";
import { Box } from "@mantine/core";

export default function Control({
  controlProps,
  ctrl,
}: {
  controlProps: ControlProps;
  ctrl: CtlManifestType;
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
    <Box
      data-cy="ctrl-grid-item"
      data-testid="ctrl-grid-item"
      w="100%"
      h="100%"
      display="flex"
      sx={{
        flexDirection: "column",
        br: 16,
        backgroundColor: theme === "dark" ? "#14131361" : "#58454517",
      }}
    >
      {isEditMode ? (
        <ControlComponent
          ctrlObj={ctrl}
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
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParamsToCtrl={attachParamsToCtrl}
          removeCtrl={removeCtrl}
          setCurrentInput={setCurrentInput}
          setOpenEditModal={setOpenEditModal}
        />
      )}
    </Box>
  );
}
