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
    source: string;
    type: string;
    mode: string;
  }[];
  setPlotData: React.Dispatch<
    React.SetStateAction<
      {
        x: number[];
        y: number[];
        z: number[];
        source: string;
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
  image: ["x", "y"],
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
  // console.log('plot options: ' + selectedPlotOption);
  // let imUrl = '';
  // const imsource = plotData[0] ? 'y' in plotData[0] ? plotData[0].y ? plotData[0].y : undefined : undefined : undefined;
  // if (imsource && imsource.length > 0) {
  //   const pixelSize = 20;
  //   const c = document.createElement("canvas");
  //   c.height = imsource.length * pixelSize;
  //   c.width = imsource.length * pixelSize;
  //   document.body.appendChild(c);
  //   const ctx = c.getContext("2d");
  //   ctx?.clearRect(0, 0, c.width, c.height);
    
  //   for (let i = 0; i < imsource.length; i++) {
  //       for (let j = 0; j < imsource.length; j++) {
  //           if(ctx) {
  //             ctx.fillStyle = "rgb("+imsource[i][j][0]+","+imsource[i][j][1]+","+imsource[i][j][2]+")";
  //             ctx?.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
  //           }
  //       }
  //   }
    
  //   console.log(c.toDataURL("image/png"));
  //   const png = document.createElement("img");
  //   png.src = c.toDataURL("image/png");
  //   c.remove();
  //   document.body.appendChild(png);
  //   imUrl = c.toDataURL("image/png");
  //   console.log("imurl: " + imUrl);
    
  // }


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
          data={[
            {
              ...plotData[0],
              type: selectedPlotOption?.value?.type!,
              mode: selectedPlotOption?.value?.mode,
              // source: imUrl
            },
          ]}
          // layout={styledPlotLayout(theme, plotData[0] ? 'y' in plotData[0] ? plotData[0].y ? plotData[0].y[0] : undefined : undefined : undefined )}
          layout={styledPlotLayout(theme)}
          style={{ width: "100%", height: "100%", transform: isEditMode ? 'scale(0.8) translateY(-60px)' : 'scale(1)' }}
        />
      </div>
    </Fragment>
  );
};

export default PlotControl;
