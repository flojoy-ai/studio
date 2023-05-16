/* eslint @typescript-eslint/no-explicit-any: 0 */
import { useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import {PlotData} from 'plotly.js'

export type OverridePlotData = Array<Partial<PlotData> & {
  header?: {
    values?: any;
    fill:{
      color: string;
    },

  },
  cells?:{
    values?: any;
    fill:{color:string};
  }
}>

type PlotProps = {
  id: string;
  data: OverridePlotData
} & Omit<PlotParams, 'data'>;

const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, id } = props;
  useEffect(() => {
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
