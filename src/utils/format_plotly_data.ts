import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { MantineTheme } from "@mantine/core";
import { PlotData } from "plotly.js";
import { DataContainer } from "@src/feature/results_panel/types/ResultsType";

const NUM_OF_COLUMNS = 2;
const NUM_OF_ROWS = 20;

export const makePlotlyData = (
  data: OverridePlotData,
  theme: MantineTheme,
  isThumbnail?: boolean
) => {
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
          values: isThumbnail
            ? d.header?.values.filter(
                (_: unknown, i: number) => i < NUM_OF_COLUMNS
              )
            : d.header?.values,
          fill: {
            color: headerFillColor,
          },
        },
        cells: {
          ...d.cells,
          align: "center",
          values: isThumbnail
            ? d.cells?.values
                .filter((_: unknown, i: number) => i < NUM_OF_COLUMNS)
                .map((i: any) =>
                  i.filter((_: unknown, index: number) => index < NUM_OF_ROWS)
                )
            : d.cells?.values,
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
      return [
        {
          x: dataContainer.c, // TODO: Not sure if this is right
          type: plotType,
          mode: plotMode,
        },
      ];
    }
    case "ordered_pair": {
      return [
        {
          x: dataContainer.x,
          y: dataContainer.y,
          type: plotType,
          mode: plotMode,
        },
      ];
    }
    case "ordered_triple": {
      return [
        {
          x: dataContainer.x,
          y: dataContainer.y,
          z: dataContainer.z, // TODO: Do we actually have z right now?
          type: plotType,
          mode: plotMode,
        },
      ];
    }
    case "dataframe": {
      const df = JSON.parse(dataContainer.m || "");
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
      return (
        dataContainer.fig?.data?.map((d) => ({
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
        })) || []
      );
    }
    default:
      console.log("Unknown data type!!");
      return [];
  }
};
