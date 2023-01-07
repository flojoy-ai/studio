import { useState } from "react";
import { NodeInputOptions, PlotControlOptions } from "../types/ControlOptions";
import { PlotControlProps } from "./PlotControl";

const PlotControlState = ({
  ctrlObj,
  nd,
  results,
  selectedOption,
  selectedPlotOption,
  setNd,
  setPlotData,
}: PlotControlProps) => {
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
    ctrlObj,
    nd,
    results,
    selectedOption,
    selectedPlotOption,
    setNd,
    setPlotData,
    inputOptions,
    plotOptions,
  };
};

export default PlotControlState;
export type PlotControlStateType = ReturnType<typeof PlotControlState>;
