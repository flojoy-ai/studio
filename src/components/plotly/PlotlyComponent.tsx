/* eslint @typescript-eslint/no-explicit-any: 0 */
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js";
import { plotLayout } from "./layout";
import { useMemo } from "react";
import { PlotProps } from "@src/types/plotly";
import { useTheme } from "@src/providers/themeProvider";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, MoreVertical } from "lucide-react";

const MATRIX_SIZE = {
  width: 240,
  height: 260,
};

const Plot = createPlotlyComponent(Plotly);

const PlotlyComponent = (props: PlotProps) => {
  const { data, layout, useResizeHandler, style, isThumbnail } = props;
  const { resolvedTheme: theme } = useTheme();
  const defaultPlotLayout = useMemo(() => plotLayout(theme), [theme]);

  const isMatrix = data[0]?.header?.values?.length === 0;
  const is3dPlot = data[0]?.type === "surface" || data[0]?.type === "scatter3d";
  // const horizontalMore =
  //   data[0]?.type === "table" &&
  //   data.every((d) => {
  //     console.log("test");
  //     return d.header?.values?.length && d.header.values.length <= 3;
  //   });
  // const verticalMore =
  //   data[0]?.type === "table" &&
  //   data.every((d) => {
  //     d.cells?.values?.some((i) => {
  //       console.log(i.length > 6);
  //       return i.length > 6;
  //     });
  //   });

  return (
    <div className="flex justify-start">
      <Plot
        data={data}
        layout={{
          ...layout,
          ...defaultPlotLayout,
          showlegend: !isThumbnail,
          ...(isThumbnail && isMatrix && MATRIX_SIZE),
        }}
        useResizeHandler={useResizeHandler}
        config={{
          displayModeBar: false,
          staticPlot: isThumbnail && !is3dPlot,
        }}
        style={isMatrix && isThumbnail ? MATRIX_SIZE : style}
      />
      {/*  {isThumbnail && horizontalMore && (*/}
      {/*    <div className="-ml-10 flex flex-col justify-center px-3">*/}
      {/*      <MoreHorizontal />*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
      {/*{isThumbnail && verticalMore && (*/}
      {/*  <div className="-mt-12 flex flex-row justify-center py-3">*/}
      {/*    <MoreVertical />*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*<div className="-ml-8 flex flex-row-reverse">*/}
      {/*  <Button variant="secondary" />*/}
      {/*</div>*/}
    </div>
  );
};

export default PlotlyComponent;
