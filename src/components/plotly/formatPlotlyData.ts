import { DataContainer2PlotlyProps, OverridePlotData } from "@src/types/plotly";

const NUM_OF_COLUMNS = 3;
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
    //   d.header.values.length > columns &&
    //   d.type === "table"
    // ) {
    //   console.log(d.header.values.length);
    //   console.log(d.cells?.values?.some((i) => i.length > rows));
    //   console.log("this worked!");
    // }
    if (d.type == "table") {
      const headerValue = isThumbnail
        ? d.header?.values?.filter(
            (_: unknown, i: number) => i < NUM_OF_COLUMNS,
          )
        : d.header?.values;

      const cellValue = isThumbnail
        ? d.cells?.values
            ?.filter(
              (_: unknown, i: number) =>
                i <
                (d.header?.values?.length ? NUM_OF_COLUMNS : MATRIX_COLUMNS),
            )
            .map(
              (column: unknown[]) =>
                column
                  ?.filter(
                    (_: unknown, index: number) =>
                      index <
                      (d.header?.values?.length ? NUM_OF_ROWS : MATRIX_COLUMNS),
                  )
                  .map((value) => {
                    return typeof value === "number" && d.header?.values?.length
                      ? value.toFixed(2)
                      : value;
                  }),
            )
        : d.cells?.values;
      return {
        ...d,
        ...{
          ...d,
          header: {
            ...d.header,
            align: "center",
            values: headerValue,
            fill: {
              color: d.header?.values?.length ? headerFillColor : "transparent",
            },
          },
          cells: {
            ...d.cells,
            align: "center",
            values: cellValue,
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
        },
      };
    }

    return {
      ...d,
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

export const findFilteredPlotlyValues = (data: OverridePlotData) => {
  const row = data[0].header?.values ? NUM_OF_ROWS : MATRIX_COLUMNS;
  const col = data[0].header?.values ? NUM_OF_COLUMNS : MATRIX_COLUMNS;
  const horizontalMore =
    data[0]?.type === "table"
      ? data.reduce((acc, cur) => {
          if (cur.header?.values?.length && cur.header.values.length > acc) {
            return cur.header.values.length;
          }
          return acc;
        }, 0) - col
      : 0;

  const verticalMore =
    data[0]?.type === "table"
      ? data.reduce((dataAcc, dataCur) => {
          if (dataCur.cells?.values) {
            return dataCur.cells.values.reduce((acc, cur) => {
              return Math.max(acc, cur.length, dataAcc);
            }, 0);
          }
          return dataAcc;
        }, 0) - row
      : 0;
  return [horizontalMore, verticalMore];
};
