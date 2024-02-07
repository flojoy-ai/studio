/* eslint @typescript-eslint/no-explicit-any: 0 */
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js";
import { plotLayout } from "./layout";
import { useMemo } from "react";
import { PlotProps } from "@/renderer/types/plotly";
import { useTheme } from "@/renderer/providers/themeProvider";
import _ from "lodash";

const MATRIX_SIZE = {
  width: 240,
  height: 260,
};

const Plot = createPlotlyComponent(Plotly);

const DEFAULT_MARGIN = {
  l: 0,
  b: 0,
  r: 0,
  t: 30,
};

const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, isThumbnail } = props;
  const { resolvedTheme: theme } = useTheme();
  const defaultPlotLayout = useMemo(() => plotLayout(theme), [theme]);

  const isMatrix = data[0]?.header?.values?.length === 0;
  const is3dPlot = data[0]?.type === "surface" || data[0]?.type === "scatter3d";

  const margin = _.isEqual(layout.margin, DEFAULT_MARGIN)
    ? defaultPlotLayout.margin
    : layout.margin;

  return (
    <Plot
      {...props}
      data={data}
      layout={{
        ...defaultPlotLayout,
        ...layout,
        margin,
        showlegend: !isThumbnail,
        ...(isThumbnail && isMatrix && MATRIX_SIZE),
      }}
      useResizeHandler={useResizeHandler}
      config={{ staticPlot: isThumbnail && !is3dPlot }}
      style={isMatrix && isThumbnail ? MATRIX_SIZE : style}
    />
  );
};

export default PlotlyComponent;
