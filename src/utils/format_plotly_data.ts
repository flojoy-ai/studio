import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { MantineTheme } from "@mantine/core";
import { DataContainer } from "@src/feature/results_panel/types/ResultsType";
import { PlotTypeNames } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { PlotData } from "plotly.js";

export const makePlotlyData = (data: OverridePlotData, theme: MantineTheme) => {
  const headerFillColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[6];
  const cellFillColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[5];
  return data.map((d) => {
    return {
      ...d,
      ...(d.type === "table" && {
        ...d,
        header: {
          ...d.header,
          fill: {
            color: headerFillColor,
          },
        },
        cells: {
          ...d.cells,
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
};

export const dataContainer2Plotly = ({
  dataContainer,
  plotType,
  plotMode,
  theme,
}: DataContainer2PlotlyProps): OverridePlotData => {
  const headerFillColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[6];
  const cellFillColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[5];
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
