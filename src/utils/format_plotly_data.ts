import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { MantineTheme } from "@mantine/core";
import {
  DataContainer,
  DataFrameData,
  OrderedPairData,
  OrderedTripleData,
  ScalarData,
} from "@src/feature/results_panel/types/ResultsType";
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
    // TODO: This match is not exausitive, missing matrix and grayscale
    case "scalar": {
      const data = dataContainer.data as ScalarData;
      return [
        {
          x: data.c, // TODO: Not sure if this is right
          type: plotType,
          mode: plotMode,
        },
      ];
    }
    case "ordered_pair": {
      const data = dataContainer.data as OrderedPairData;
      return [
        {
          x: data.x,
          y: data.y,
          type: plotType,
          mode: plotMode,
        },
      ];
    }
    case "ordered_triple": {
      const data = dataContainer.data as OrderedTripleData;
      return [
        {
          x: data.x,
          y: data.y,
          z: data.z, // TODO: Do we actually have z right now?
          type: plotType,
          mode: plotMode,
        },
      ];
    }
    case "dataframe": {
      const data = dataContainer.data as DataFrameData;
      const df = JSON.parse(data.m);
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
    }
    case "image":
      return fig!;
    case "plotly": {
      const data = dataContainer.data as OverridePlotData;
      return data.map((d) => ({
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
      }));
    }
    default:
      console.log("Unknown data type!!");
      return [];
  }
};
