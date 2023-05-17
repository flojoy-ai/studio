/* eslint @typescript-eslint/no-explicit-any: 0 */
import { useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";

type PlotProps = {
  id: string;
} & PlotParams;

// TODO: Why does this rerender constantly after first run?
const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, id } = props;
  useEffect(() => {
    console.log("5");
    if (!window) {
      return;
    }
    (window as any).plotlyOutput = {
      ...(window as any).plotlyOutput,
      [id]: { data },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id]);

  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={useResizeHandler}
      style={style}
    />
  );
};

export default PlotlyComponent;
