import { CtlManifestType } from "@src/hooks/useFlowChartState";
import Select, { ThemeConfig } from "react-select";
import { Dispatch, Fragment } from "react";
import { ControlOptions, PlotControlOptions } from "../types/ControlOptions";
import customDropdownStyles from "../style/CustomDropdownStyles";
import Plot from "react-plotly.js";
import styledPlotLayout from "@src/feature/common/defaultPlotLayout";
import { SetStateAction } from "jotai";
import { PlotData } from "plotly.js";
import {
  ResultIO,
  ResultsType,
} from "@src/feature/results_panel/types/ResultsType";
import PlotControlState from "./PlotControlState";
import usePlotControlEffect from "@src/hooks/usePlotControlEffect";

export interface PlotControlProps {
  nd: ResultIO | null;
  setNd: Dispatch<React.SetStateAction<ResultIO | null>>;
  ctrlObj: CtlManifestType;
  results: ResultsType;
  isEditMode: boolean;
  selectedOption: ControlOptions | undefined;
  theme: "light" | "dark";
  selectedPlotOption: PlotControlOptions | undefined;
  setSelectedPlotOption: Dispatch<
    SetStateAction<PlotControlOptions | undefined>
  >;
  plotData: {
    x: number[];
    y: number[];
    z: number[];
    type: string;
    mode: string;
  }[];
  setPlotData: React.Dispatch<
    React.SetStateAction<
      {
        x: number[];
        y: number[];
        z: number[];
        type: string;
        mode: string;
      }[]
    >
  >;
}
const plotInputKeys: Partial<Record<PlotData["type"], string[]>> = {
  histogram: ["x"],
  bar: ["x", "y"],
  scatter3d: ["x", "y", "z"],
  scatter: ["x", "y"],
  surface: ["x", "y", "z"],
};
const PlotControl = ({
  nd,
  setNd,
  ctrlObj,
  results,
  isEditMode,
  selectedOption,
  theme,
  setPlotData,
  selectedPlotOption,
  plotData,
  setSelectedPlotOption,
}: PlotControlProps) => {
  const {
    inputOptions,
    plotOptions,
    selectedKeys,
    setInputOptions,
    setPlotOptions,
    setSelectedKeys,
  } = PlotControlState({
    nd,
    setNd,
    ctrlObj,
    results,
    isEditMode,
    selectedOption,
    theme,
    setPlotData,
    selectedPlotOption,
    plotData,
    setSelectedPlotOption,
  });
  usePlotControlEffect({
    inputOptions,
    plotOptions,
    selectedKeys,
    setInputOptions,
    setPlotOptions,
    setSelectedKeys,
    ctrlObj,
    nd,
    results,
    selectedOption,
    selectedPlotOption,
    setNd,
    setPlotData,
  });

  return (
    <Fragment>
      {!isEditMode && (
        <Fragment>
          <p className="ctrl-param">Plot: {selectedPlotOption?.label}</p>
        </Fragment>
      )}

      {isEditMode && (
        <Select
          className="select-plot-type"
          isSearchable={true}
          onChange={(val) => {
            if (val) {
              setSelectedPlotOption(val);
            }
          }}
          placeholder="Select Plot Type"
          theme={theme as unknown as ThemeConfig}
          options={plotOptions}
          styles={customDropdownStyles}
          value={selectedPlotOption}
        />
      )}

      {isEditMode && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
          }}
        >
          {plotInputKeys[selectedPlotOption?.value.type!]?.map((key) => (
            <Select
              key={key}
              className="select-plot-type"
              isSearchable={true}
              onChange={(val) => {
                if (val) {
                  setSelectedKeys((prev) => ({
                    ...prev,
                    [key]: val,
                  }));
                }
              }}
              placeholder={`Select ${key.toUpperCase()}`}
              options={inputOptions}
              styles={customDropdownStyles}
              theme={theme as unknown as ThemeConfig}
              value={selectedKeys && selectedKeys![key] || ''}
            />
          ))}
        </div>
      )}

      <div
        style={{
          flex: "1",
          height: "100%",
          width: "100%",
          paddingBottom: "10px",
        }}
      >
        <Plot
          data={[
            {
              ...plotData[0],
              type: selectedPlotOption?.value?.type!,
              mode: selectedPlotOption?.value?.mode,
            },
          ]}
          layout={styledPlotLayout(theme, plotData[0] ? 'y' in plotData[0] ? plotData[0].y ? plotData[0].y[0] : undefined : undefined : undefined )}
          style={{ width: "100%", height: "100%", transform: isEditMode ? 'scale(0.8) translateY(-60px)' : 'scale(1)' }}
        />
      </div>
    </Fragment>
  );
};

export default PlotControl;
