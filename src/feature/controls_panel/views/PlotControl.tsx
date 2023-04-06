import { CtlManifestType } from "@src/hooks/useFlowChartState";
import Select, { ThemeConfig } from "react-select";
import { Dispatch, Fragment } from "react";
import { PlotControlOptions } from "../types/ControlOptions";
import customDropdownStyles from "../style/CustomDropdownStyles";
import Plot from "react-plotly.js";
import styledPlotLayout from "@src/feature/common/defaultPlotLayout";
import { SetStateAction } from "jotai";
import { Data, PlotData } from "plotly.js";
import {
  ResultIO,
} from "@src/feature/results_panel/types/ResultsType";
import PlotControlState from "./PlotControlState";
import usePlotControlEffect from "@src/hooks/usePlotControlEffect";

export interface PlotControlProps {
  nd: ResultIO | null;
  ctrlObj: CtlManifestType;
  isEditMode: boolean;
  theme: "light" | "dark";
  selectedPlotOption: PlotControlOptions | undefined;
  setSelectedPlotOption: Dispatch<
    SetStateAction<PlotControlOptions | undefined>
  >;
  plotData: Data[];
  setPlotData: React.Dispatch<
    React.SetStateAction<
    Data[]
    >
  >;
}
const plotInputKeys: Partial<Record<PlotData["type"], string[]>> = {
  histogram: ["x"],
  bar: ["x", "y"],
  scatter3d: ["x", "y", "z"],
  scatter: ["x", "y"],
  surface: ["x", "y", "z"],
  image: [],
};
const PlotControl = ({
  nd,
  ctrlObj,
  isEditMode,
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
  } = PlotControlState();
  usePlotControlEffect({
    inputOptions,
    plotOptions,
    selectedKeys,
    setInputOptions,
    setPlotOptions,
    setSelectedKeys,
    ctrlObj,
    nd,
    selectedPlotOption,
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
              value={(selectedKeys && selectedKeys![key]) || ""}
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
          data={plotData}
          layout={Object.assign( {}, styledPlotLayout(theme))}
          style={{ width: "100%", height: "100%", transform: isEditMode ? 'scale(0.8) translateY(-60px)' : 'scale(1)' }}
        />
      </div>
    </Fragment>
  );
};

export default PlotControl;