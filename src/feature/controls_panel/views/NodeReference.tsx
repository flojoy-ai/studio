import {
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { useEffect, useState } from "react";
import Select, { ThemeConfig } from "react-select";
import customDropdownStyles from "../style/CustomDropdownStyles";
import { ControlComponentProps } from "./control-component/ControlComponent";

export interface NodeReferenceProps {
  theme: "light" | "dark";
  updateCtrlValue: ControlComponentProps["updateCtrlValue"];
  ctrlObj: ControlComponentProps["ctrlObj"];
}

const NodeReference = ({
  theme,
  updateCtrlValue,
  ctrlObj,
}: NodeReferenceProps) => {
  const { rfInstance } = useFlowChartState();
  const [selectedOption, setSelectedOption] = useState({
    label: "Select Node",
    value: "",
  });
  useEffect(() => {
    setSelectedOption({
      label: rfInstance?.nodes.find((node) => node.id === ctrlObj.val)?.data
        .label!,
      value: rfInstance?.nodes.find((n) => n.id === ctrlObj.val)?.id!,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrlObj.param, rfInstance?.nodes]);
  return (
    <div className="ctrl-input-body">
      <Select
        className="select-node"
        isSearchable={true}
        onChange={(val) => {
          updateCtrlValue(
            (val as { label: string; value: string }).value,
            ctrlObj
          );
        }}
        isDisabled={
          (ctrlObj.param as CtrlManifestParam)?.type !== "node_reference"
        }
        theme={theme as unknown as ThemeConfig}
        options={rfInstance?.nodes.map((n) => ({
          label: `${n.data.label} - ${n.data.func}`,
          value: n.id,
        }))}
        styles={customDropdownStyles}
        value={selectedOption}
      />
    </div>
  );
};

export default NodeReference;
