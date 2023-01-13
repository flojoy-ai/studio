import {
  CtlManifestType,
  CtrlManifestParam,
} from "@src/hooks/useFlowChartState";
import { WritableDraft } from "immer/dist/internal";
import React, { useCallback, useEffect, useState } from "react";
import { Silver } from "react-dial-knob";
import ReactGridLayout from "react-grid-layout";
import { ControlOptions } from "../types/ControlOptions";

interface KnobCtrlProps {
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
      if (!(ctrlObj?.param as CtrlManifestParam)?.nodeId) {
        setKnobValue(value);
        return;
      }
      updateCtrlValue(value.toString(), ctrlObj);
    },
    [ctrlObj]
  );

  useEffect(() => {
    return () => {
      setKnobValue(0);
    };
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
    >
      <Silver
        style={{ width: "fit-content", boxShadow: "0" }}
        // diameter={70}
        knobStyle={{ boxShadow: "0" }}
        min={0}
        max={100}
        step={1}
        value={knobValue || currentInputValue}
        diameter={120}
        onValueChange={(val) => {
          console.log(" onValueChange: ", val);
          updateCtrlValueFromKnob(val);
        }}
        ariaLabelledBy={"my-label"}
      />
    </div>
  );
};

export default KnobCtrl;
