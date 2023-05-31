import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { CtlManifestType } from "@src/hooks/useFlowChartState";
import { Dispatch, SetStateAction } from "react";
import { CtrlOptionValue } from "./ControlOptions";
import { ParamValueType } from "@feature/common/types/ParamValueType";

export interface ControlProps {
  isEditMode: boolean;
  results: ResultsType;
  updateCtrlValue: (val: string, ctrl: CtlManifestType) => void;
  attachParamsToCtrl: (param: CtrlOptionValue, ctrl: CtlManifestType) => void;
  removeCtrl: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ctrl: CtlManifestType
  ) => void;
  setCurrentInput: Dispatch<
    SetStateAction<
      | (CtlManifestType & {
          index: number;
        })
      | undefined
    >
  >;
  setOpenEditModal: Dispatch<SetStateAction<boolean>>;
}
