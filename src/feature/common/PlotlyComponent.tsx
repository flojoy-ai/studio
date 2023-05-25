/* eslint @typescript-eslint/no-explicit-any: 0 */
import { useEffect } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import type { PlotParams } from "react-plotly.js";
import { PlotData } from "plotly.js";
import usePlotLayout from "./usePlotLayout";
// Uncomment this line after running npm run bundle-plotly to reduce the bundle size
// import Plotly from "plotly.js/dist/plotly-custom.min";
import Plotly from "plotly.js/dist/plotly";

export type OverridePlotData = Array<
  Partial<PlotData> & {
    header?: {
      values?: any;
      fill: {
        color: string;
      };
    };
    cells?: {
      values?: any;
      fill: { color: string };
    };
  }
>;

type PlotProps = {
  id: string;
  data: OverridePlotData;
  isThumbnail?: boolean;
} & Omit<PlotParams, "data">;

const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, id, isThumbnail } = props;
  const defaultPlotLayout = usePlotLayout();
  const Plot = createPlotlyComponent(Plotly);

  useEffect(() => {
    if (!window) {
      return;
    }
    (window as any).plotlyOutput = {
      ...(window as any).plotlyOutput,
      [id]: { data },
    };
  }, [data, id]);

  return (
    <Plot
      data={data}
      layout={{
        ...layout,
        ...defaultPlotLayout,
        showlegend: !isThumbnail,
      }}
      useResizeHandler={useResizeHandler}
      config={{ displayModeBar: false }}
      style={style}
    />
  );
};

export default PlotlyComponent;
