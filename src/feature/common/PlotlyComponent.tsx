/* eslint @typescript-eslint/no-explicit-any: 0 */
import { useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { PlotData } from "plotly.js";

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

// TODO: Why does this rerender constantly after first run?
const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, id, isThumbnail } = props;
  useEffect(() => {
    console.log("5");
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
      layout={{ ...layout, showlegend: !isThumbnail }}
      useResizeHandler={useResizeHandler}
      config={{ displayModeBar: false }}
      style={style}
    />
  );
};

export default PlotlyComponent;
