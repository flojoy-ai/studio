import { OverridePlotData } from "@/renderer/types/plotly";

const NUM_OF_COLUMNS = 4;
const NUM_OF_ROWS = 20;
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
                .map((i: unknown[]) =>
                  i?.filter(
                    (_: unknown, index: number) =>
                      index <
                      (d.header?.values?.length ? NUM_OF_ROWS : MATRIX_COLUMNS),
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
