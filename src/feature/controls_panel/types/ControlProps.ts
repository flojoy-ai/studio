import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { CtlManifestType } from "@hooks/useFlowChartState";
import { ParamValueType } from "@feature/common/types/ParamValueType";

export interface ControlProps {
  isEditMode: any;
  results: ResultsType;
  updateCtrlValue: (
    value: string,
    ctrl: CtlManifestType,
    ValType: ParamValueType
  ) => void;
  attachParamsToCtrl: any;
  removeCtrl: any;
  setCurrentInput: any;
  setOpenEditModal: any;
}
