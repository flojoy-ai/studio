import { useState } from "react";
import { NodeInputOptions, PlotControlOptions } from "../types/ControlOptions";

const PlotControlState = () => {
  const [inputOptions, setInputOptions] = useState<NodeInputOptions[]>([]);
  const [plotOptions, setPlotOptions] = useState<PlotControlOptions[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Record<string, any> | null>(
    null
  );

  return {
    setInputOptions,
    setPlotOptions,
    selectedKeys,
    setSelectedKeys,
    inputOptions,
    plotOptions,
  };
};

export default PlotControlState;
export type PlotControlStateType = ReturnType<typeof PlotControlState>;
