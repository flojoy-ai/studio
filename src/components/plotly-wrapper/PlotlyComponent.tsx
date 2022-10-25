import { useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";

type PlotProps = {
  id: string;
} & PlotParams;

const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, id } = props;
  useEffect(() => {
    return()=>{
    (window as any).plotlyOutput = {
      ...(window as any).plotlyOutput,
      [id]: props,
    };
}
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
