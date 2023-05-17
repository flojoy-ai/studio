import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { CtlManifestType } from "@hooks/useFlowChartState";
import { CtrlValueType } from "@feature/controls_panel/types/CtrlValue";

export interface ControlProps {
  isEditMode: any;
  results: ResultsType;
  updateCtrlValue: (
    value: string,
    ctrl: CtlManifestType,
    ValType: CtrlValueType
  ) => void;
  attachParamsToCtrl: any;
  removeCtrl: any;
  setCurrentInput: any;
  setOpenEditModal: any;
}
