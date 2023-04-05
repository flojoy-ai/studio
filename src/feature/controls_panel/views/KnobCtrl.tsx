import {
  CtlManifestType,
  CtrlManifestParam,
} from "@src/hooks/useFlowChartState";
import { WritableDraft } from "immer/dist/internal";
import { useCallback, useEffect, useState, memo } from "react";
import Silver from "@src/utils/SilverKnob";
import ReactGridLayout from "react-grid-layout";
import { ControlOptions } from "../types/ControlOptions";

export interface KnobCtrlProps {
  makeLayoutStatic: () => void;
  isEditMode: boolean;
  ctrlObj: CtlManifestType;
  selectedOption: ControlOptions | undefined;
  setGridLayout: (
    update:
      | ReactGridLayout.Layout[]
      | ((draft: WritableDraft<ReactGridLayout.Layout>[]) => void)
  ) => void;
  updateCtrlValue: (value: string, ctrl: CtlManifestType) => void;
  currentInputValue: number;
}

const KnobCtrl = ({
  makeLayoutStatic,
  isEditMode,
  setGridLayout,
  ctrlObj,
  updateCtrlValue,
  currentInputValue,
  selectedOption,
}: KnobCtrlProps) => {
  const [knobValue, setKnobValue] = useState(0);
  const updateCtrlValueFromKnob = useCallback(
    (value: number) => {
      if ((ctrlObj?.param as CtrlManifestParam)?.nodeId) {
        updateCtrlValue(value.toString(), ctrlObj);
      }
      setKnobValue(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(ctrlObj?.param as CtrlManifestParam)?.nodeId]
  );

  useEffect(() => {
    return () => {
      setKnobValue(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  return (
    <div
      onMouseEnter={makeLayoutStatic}
      onMouseLeave={() => {
        if (isEditMode) {
          setGridLayout((prev) => {
            prev[prev.findIndex((layout) => layout.i === ctrlObj.id)].static =
              false;
          });
        }
      }}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      data-testid={"KnobCtrlDiv"}
    >
      <Silver
        style={{
          width: "fit-content",
          boxShadow: "0",
          zIndex: 1,
        }}
        // diameter={70}
        knobStyle={{ boxShadow: "0", background: "none" }}
        min={0}
        max={100}
        step={1}
        value={knobValue || currentInputValue}
        diameter={180}
        onValueChange={updateCtrlValueFromKnob}
        ariaLabelledBy={"my-label"}
      ></Silver>
    </div>
  );
};

export default memo(KnobCtrl);
