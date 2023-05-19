import { CtlManifestType } from "@src/hooks/useFlowChartState";
import Select, { ThemeConfig } from "react-select";
import { Dispatch, Fragment } from "react";
import { PlotControlOptions } from "../types/ControlOptions";
import customDropdownStyles from "../style/CustomDropdownStyles";
import Plot from "react-plotly.js";
import usePlotLayout from "@src/feature/common/usePlotLayout";
import { SetStateAction } from "jotai";
import { Data, PlotData } from "plotly.js";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import PlotControlState from "./PlotControlState";
import usePlotControlEffect from "@src/hooks/usePlotControlEffect";
import { useMantineColorScheme } from "@mantine/styles";
import { Text, useMantineTheme } from "@mantine/core";
import { useControlStyles } from "./control-component/ControlComponent";
import PlotlyComponent, {
  OverridePlotData,
} from "@src/feature/common/PlotlyComponent";

export interface PlotControlProps {
  nd: ResultIO | null;
  ctrlObj: CtlManifestType;
  isEditMode: boolean;
  selectedPlotOption: PlotControlOptions | undefined;
  setSelectedPlotOption: Dispatch<
    SetStateAction<PlotControlOptions | undefined>
  >;
  plotData: OverridePlotData;
  setPlotData: React.Dispatch<React.SetStateAction<OverridePlotData>>;
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
  const theme = useMantineTheme();
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
    theme,
  });

  const colorScheme = useMantineColorScheme().colorScheme;
  const { classes } = useControlStyles();
  const plotLayout = usePlotLayout();

  return (
    <Fragment>
      {!isEditMode && (
        <Fragment>
          <Text className={classes.param}>
            Plot: {selectedPlotOption?.label}
          </Text>
        </Fragment>
      )}

      {isEditMode && (
        <Select
          className={classes.selectPlotType}
          isSearchable={true}
          onChange={(val) => {
            if (val) {
              setSelectedPlotOption(val);
            }
          }}
          placeholder="Select Plot Type"
          theme={colorScheme as unknown as ThemeConfig}
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
              className={classes.selectPlotType}
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
              theme={colorScheme as unknown as ThemeConfig}
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
        <PlotlyComponent
          data={plotData}
          layout={plotLayout}
          useResizeHandler
          id={ctrlObj.id}
          style={{
            width: "100%",
            height: "100%",
            transform: isEditMode ? "scale(0.8) translateY(-60px)" : "scale(1)",
          }}
        />
      </div>
    </Fragment>
  );
};

export default PlotControl;
