import clone from "just-clone";
import localforage from "localforage";
import React, { useCallback } from "react";
import "./style/Controls.css";

import "@src/App.css";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { saveAndRunFlowChartInServer } from "@src/services/FlowChartServices";
import { useSocket } from "@src/hooks/useSocket";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { useControlsTabState } from "./ControlsTabState";
import ControlGrid from "./views/ControlGrid";
import { useControlsTabEffects } from "./ControlsTabEffects";
import { CtrlOptionValue } from "./types/ControlOptions";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { createStyles } from "@mantine/styles";
import { useMantineTheme } from "@mantine/styles";

export const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.modal[0],
      border: theme.colors.accent1[0],
      cursor: "pointer",
    },
  };
});

localforage.config({ name: "react-flow", storeName: "flows" });
interface ControlsTabProps {
  results: ResultsType;
}

const ControlsTab = ({
  results,
}: ControlsTabProps) => {
  const { states } = useSocket();
  const { socketId, setProgramResults } = states!;
  const {
    setOpenEditModal,
    setCurrentInput,
    debouncedTimerId,
    setDebouncedTimerId,
  } = useControlsTabState();

  const {
    rfInstance,
    nodes,
    updateCtrlInputDataForNode,
    ctrlsManifest,
    setCtrlsManifest,
    isEditMode,
  } = useFlowChartState();

  function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  const saveAndRunFlowChart = useCallback(() => {
    if (debouncedTimerId) {
      clearTimeout(debouncedTimerId);
    }
    const timerId = setTimeout(() => {
      setProgramResults({ io: [] });
      saveAndRunFlowChartInServer({ rfInstance, jobId: socketId });
    }, 3000);

    setDebouncedTimerId(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTimerId, rfInstance]);

  useControlsTabEffects();

  const removeCtrl = (e: any, ctrl: any = undefined) => {
    const ctrlId = e.target.id;
    console.warn("Removing", ctrlId, ctrl);
    const filterChilds = ctrlsManifest.filter((ctrl) => ctrl.id !== ctrlId);
    cacheManifest(filterChilds);

    // if (ctrl.param) {
    //   removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
    //   saveAndRunFlowChart();
    // }
  };

  const updateCtrlValue = (val: string, ctrl: CtlManifestType) => {
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      // if (c.id === ctrl.id) {
      //   manClone[i].val = isNaN(+val) ? val : +val;
      // }
    });
    cacheManifest(manClone);
    updateCtrlInputDataForNode(
      (ctrl.param! as CtrlManifestParam).nodeId,
      (ctrl.param! as CtrlManifestParam).param,
      {
        functionName: (ctrl.param! as CtrlManifestParam).functionName,
        param: (ctrl.param! as CtrlManifestParam).param,
        value: val,
      }
    );
  };

  const attachParamsToCtrl = (
    param: CtrlOptionValue,
    ctrl: CtlManifestType
  ) => {
    // grab the current value for this param if it already exists in the flowchart nodes
    const inputNode = nodes.find((e) => e.id === param.nodeId);
    const ctrls = inputNode?.data?.ctrls;
    const fnParams = FUNCTION_PARAMETERS[param?.functionName] || {};
    // debugger
    const fnParam = fnParams[param?.param];
    const defaultValue =
      param.functionName === "CONSTANT"
        ? ctrl.val
        : fnParam?.default
        ? fnParam.default
        : 0;
    const ctrlData = ctrls && ctrls[param.param];
    const inputValue = isNaN(+ctrlData?.value!)
      ? ctrlData?.value
      : +ctrlData?.value!;
    const currentInputValue = ctrlData ? inputValue : defaultValue;
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].param = param;
        manClone[i].val = currentInputValue;
      }
    });
    cacheManifest(manClone);
  };

  return (
    <div data-testid="controls-tab">
      <ControlGrid
        controlProps={{
          isEditMode,
          results,
          updateCtrlValue,
          attachParamsToCtrl,
          removeCtrl,
          setCurrentInput,
          setOpenEditModal,
        }}
      />
    </div>
  );
};

export default ControlsTab;
