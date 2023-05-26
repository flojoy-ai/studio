/* eslint @typescript-eslint/no-explicit-any: 0 */
import { useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { PlotData } from "plotly.js";
import usePlotLayout from "./usePlotLayout";

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
  layout: any;
} & Omit<PlotParams, "data">;

// TODO: Why does this rerender constantly after first run?
const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, id, isThumbnail } = props;
  const defaultPlotLayout = usePlotLayout();
  const isMatrix = data[0]?.header?.values.length === 0;

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
        ...(isThumbnail && isMatrix
          && getSizeForMatrix())
      }}
      useResizeHandler={useResizeHandler}
      config={{ displayModeBar: false, staticPlot: isThumbnail }}
      style={ isMatrix && isThumbnail ? getSizeForMatrix() : style}
    />
  );
};

export default PlotlyComponent;

const getSizeForMatrix = () => {
  return {
    width: 240,
    height:260,
  };
};
