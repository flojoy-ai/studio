import { DataContainer2PlotlyProps, OverridePlotData } from "@src/types/plotly";

const NUM_OF_COLUMNS = 4;
const NUM_OF_ROWS = 5;
const MATRIX_COLUMNS = 4;

export const makePlotlyData = (
  data: OverridePlotData,
  theme: "light" | "dark",
  isThumbnail?: boolean,
) => {
  const headerFillColor = theme === "light" ? "#ffffff" : "#191919";
  const cellFillColor = "transparent";
  const matrixFontColor = theme === "dark" ? "#f8f9fa" : "#111111";

  const accentColor = theme === "dark" ? "#99f5ff" : "#7b61ff";
  return data.map((d, d_index) => {
    // if (
    //   d.header?.values?.length &&
    //   d.header.values.length > NUM_OF_COLUMNS &&
    //   d.type === "table"
    // ) {
    //   console.log(d.header.values.length);
    //   console.log(d.cells?.values?.some((i) => i.length > NUM_OF_ROWS));
    //   console.log("this worked!");
    // }
    return {
      ...d,
      ...(d.type === "table" && {
        ...d,
        header: {
          ...d.header,
          align: "center",
          values: isThumbnail
            ? d.header?.values?.filter(
                (_: unknown, i: number) => i < NUM_OF_COLUMNS,
              )
            : d.header?.values,
          fill: {
            color: d.header?.values?.length ? headerFillColor : "transparent",
          },
        },
        cells: {
          ...d.cells,
          align: "center",
          values: isThumbnail
            ? d.cells?.values
                ?.filter(
                  (_: unknown, i: number) =>
                    i <
                    (d.header?.values?.length
                      ? NUM_OF_COLUMNS
                      : MATRIX_COLUMNS),
                )
                .map(
                  (i: unknown[]) =>
                    i?.filter(
                      (_: unknown, index: number) =>
                        index <
                        (d.header?.values?.length
                          ? NUM_OF_ROWS
                          : MATRIX_COLUMNS),
                    ),
                )
            : d.cells?.values,
          fill: {
            color: cellFillColor,
          },
          ...(!d.header?.values?.length && {
            font: { color: matrixFontColor },
          }),
          ...(isThumbnail && {
            height: 40,
          }),
        },
      }),
      ...(d_index === 0 && {
        marker: {
          ...d.marker,
          color: accentColor,
        },
        line: {
          ...d.line,
          color: accentColor,
        },
      }),
    };
  });
};

export const dataContainer2Plotly = ({
  dataContainer,
  plotType,
  plotMode,
  theme,
  fig,
}: DataContainer2PlotlyProps): OverridePlotData => {
  const headerFillColor = theme === "light" ? "#ffffff" : "#191919";
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
        Object.values(value as Record<string, unknown>),
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
