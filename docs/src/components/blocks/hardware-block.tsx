import React, { memo } from "react";
import { type BlockProps } from "./types/block";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/hooks/useBlockIcon";

export type HardwareCategory =
  | "HARDWARE"
  | "FUNCTION_GENERATORS"
  | "ROBOTICS"
  | "IMAGING"
  | "NATIONAL_INSTRUMENTS"
  | "MOTORS"
  | "PROTOCOLS"
  | "MULTIMETERS"
  | "DAQ_BOARDS"
  | "OSCILLOSCOPES";

const HardwareBlock = (props: BlockProps) => {
  const { SvgIcon } = useBlockIcon(
    props.type.toLowerCase().replaceAll("_", "-"),
    props.data.func,
  );
  return (
    <DefaultBlock {...props} variant="accent4">
      {SvgIcon && <SvgIcon />}
    </DefaultBlock>
  );
};

export default memo(HardwareBlock);
