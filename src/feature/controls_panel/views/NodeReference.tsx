import {
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { useEffect, useState } from "react";
import Select from "react-select";
import customDropdownStyles from "../style/CustomDropdownStyles";
import {
  ControlComponentProps,
  useControlStyles,
} from "./control-component/ControlComponent";
import { Box } from "@mantine/core";
import { ParamValueType } from "@feature/common/types/ParamValueType";

interface NodeReferenceProps {
  updateCtrlValue: ControlComponentProps["updateCtrlValue"];
  ctrlObj: ControlComponentProps["ctrlObj"];
}

const NodeReference = ({ updateCtrlValue, ctrlObj }: NodeReferenceProps) => {
  const { classes } = useControlStyles();
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
    <Box className={classes.inputBody}>
      <Select
        className={classes.selectNode}
        isSearchable={true}
        onChange={(val) => {
          updateCtrlValue(
            (val as { label: string; value: string }).value,
            ctrlObj,
            "unknown"
          );
        }}
        isDisabled={
          (ctrlObj.param as CtrlManifestParam)?.type !== "node_reference"
        }
        options={rfInstance?.nodes.map((n) => ({
          label: `${n.data.label} - ${n.data.func}`,
          value: n.id,
        }))}
        styles={customDropdownStyles}
        value={selectedOption}
      />
    </Box>
  );
};

export default NodeReference;
