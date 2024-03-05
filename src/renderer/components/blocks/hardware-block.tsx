import React, { memo, useMemo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DefaultBlock from "./default-block";
import HardwareSvg from "@/renderer/assets/blocks/hardware/hardware-svg";
import FnGeneratorsSvg from "@/renderer/assets/blocks/hardware/fn-generators-svg";
import RoboticsSvg from "@/renderer/assets/blocks/hardware/robotics-svg";
import ImagingSvg from "@/renderer/assets/blocks/hardware/imaging-svg";
import InstrumentsSvg from "@/renderer/assets/blocks/hardware/instruments-svg";
import MotorsSvg from "@/renderer/assets/blocks/hardware/motors-svg";
import ProtocolsSvg from "@/renderer/assets/blocks/hardware/protocols-svg";
import MultimetersSvg from "@/renderer/assets/blocks/hardware/multimeters-svg";
import DaqBoardsSvg from "@/renderer/assets/blocks/hardware/daq-boards-svg";
import OscilloscopeSvg from "@/renderer/assets/blocks/hardware/oscilloscope-svg";

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

const hardwareCategorySVGMap: Record<
  HardwareCategory,
  React.FC<{ blockName: string }>
> = {
  HARDWARE: HardwareSvg,
  FUNCTION_GENERATORS: FnGeneratorsSvg,
  ROBOTICS: RoboticsSvg,
  IMAGING: ImagingSvg,
  NATIONAL_INSTRUMENTS: InstrumentsSvg,
  MOTORS: MotorsSvg,
  PROTOCOLS: ProtocolsSvg,
  MULTIMETERS: MultimetersSvg,
  DAQ_BOARDS: DaqBoardsSvg,
  OSCILLOSCOPES: OscilloscopeSvg,
};

const HardwareBlock = (props: BlockProps) => {
  const SelectedHardwareSvg = useMemo(
    () =>
      props.type in hardwareCategorySVGMap
        ? hardwareCategorySVGMap[props.type]
        : hardwareCategorySVGMap.HARDWARE,
    [props.type],
  );
  return (
    <DefaultBlock {...props} variant="accent4">
      <SelectedHardwareSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(HardwareBlock);
