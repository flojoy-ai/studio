import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { MantineTheme } from "@mantine/core";
import { DataContainer } from "@src/feature/results_panel/types/ResultsType";
import { PlotData } from "plotly.js";

const NUM_OF_COLUMNS = 4;
const NUM_OF_ROWS = 20;

export const makePlotlyData = (data: OverridePlotData, theme: MantineTheme) => {
  const headerFillColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[6];
  const cellFillColor = "transparent";
  return data.map((d) => {
    return {
      ...d,
      ...(d.type === "table" && {
        ...d,
        header: {
          ...d.header,
          align: "center",
          values: d.header?.values.filter(
            (_: any, i: number) => i < NUM_OF_COLUMNS
          ),
          fill: {
            color: headerFillColor,
          },
        },
        cells: {
          ...d.cells,
          align: "center",
          values: d.cells?.values
            .filter((_: any, i: number) => i < NUM_OF_COLUMNS)
            .map((i: any) =>
              i.filter((_: any, index: number) => index < NUM_OF_ROWS)
            ),
          fill: {
            color: cellFillColor,
          },
        },
      }),
      marker: {
        ...d.marker,
      },
    };
  });
};

type DataContainer2PlotlyProps = {
  dataContainer: DataContainer;
  plotType: PlotData["type"];
  plotMode?: PlotData["mode"];
  theme: MantineTheme;
  fig?: OverridePlotData;
};

export const dataContainer2Plotly = ({
  dataContainer,
  plotType,
  plotMode,
  theme,
  fig,
}: DataContainer2PlotlyProps): OverridePlotData => {
  const headerFillColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[6];
  const cellFillColor = "transparent";
  switch (dataContainer.type) {
    case "ordered_pair":
      return [
        {
          x: dataContainer.x!,
          y: dataContainer.y!,
          type: plotType,
          mode: plotMode,
        },
      ];
    case "dataframe":
      const df = JSON.parse(dataContainer.m!);
      const headerValues = Object.keys(df);
      const cellValues = Object.values(df).map((value) =>
        Object.values(value as Record<string, any>)
      );
      return [
        {
          type: "table",
          header: {
            values: headerValues,
            fill: {
              color: headerFillColor,
            },
          },
          cells: {
            values: cellValues,
            fill: {
              color: cellFillColor,
            },
          },
        },
      ];
    case "image":
      return fig!;
    case "plotly":
      return dataContainer.fig?.data?.map((d) => ({
        ...d,
        header: {
          ...d.header,
          align: "center",
          fill: {
            color: headerFillColor,
          },
        },
        cells: {
          ...d.cells,
          align: "center",
          fill: {
            color: cellFillColor,
          },
        },
      }))!;
    default:
      return [
        {
          x: dataContainer.x!,
          y: dataContainer.y!,
          type: plotType,
          mode: plotMode,
        },
      ];
  }
};
