import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { OrderedPairData } from "@src/feature/common/types/ResultsType";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import {
  CartesianCoordinateSystem,
  LineStrip,
  LinearScale,
  LogScale,
  OrthoAxis,
} from "candygraph";
import { useCandyGraph } from "@src/hooks/useCandyGraph";
import { useTheme } from "@src/providers/themeProvider";
import {
  PLOT_HEIGHT,
  PLOT_WIDTH,
  darkTheme,
  lightTheme,
} from "./plotConstants";
import LineChart from "@src/assets/nodes/LineChart";
import { useMemo, useRef } from "react";

const viewport = { x: 0, y: 0, width: PLOT_WIDTH, height: PLOT_HEIGHT };


// TODO: Fix GC issue
const LineNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);
  const { resolvedTheme } = useTheme();
  const { cg, font } = useCandyGraph({
    width: viewport.width,
    height: viewport.height,
  });

  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  const xscale = useRef(new LinearScale([0, 100], [32, viewport.width - 16]));
  const yscale = useRef<LinearScale | LogScale>(new LinearScale([0, 100], [32, viewport.height - 16]));
  const coords = useRef(new CartesianCoordinateSystem(cg, xscale.current, yscale.current));

  const axes = useMemo(() => {
    if (!font) return [];
    console.log("Updating axes");

    return [
      new OrthoAxis(cg, coords.current, "x", font, {
        labelSide: 1,
        tickStep: 10,
        tickLength: 5,
        tickOffset: -2,
        axisColor: [0.5, 0.5, 0.5, 1],
        tickColor: [0.5, 0.5, 0.5, 1],
        labelColor: theme.text,
      }),
      new OrthoAxis(cg, coords.current, "y", font, {
        tickOffset: 2,
        tickLength: 5,
        tickStep: 10,
        axisColor: [0.5, 0.5, 0.5, 1],
        tickColor: [0.5, 0.5, 0.5, 1],
        labelColor: theme.text,
      }),
    ]
  }, [cg, font, coords, theme]);

  if (!nodeResult?.result?.data) {
    return (
      <NodeWrapper nodeError={nodeError}>
        <div
          className={clsx(
            "rounded-2xl bg-transparent",
            { "shadow-around shadow-accent2": nodeRunning || selected },
            { "shadow-around shadow-red-700": nodeError },
          )}
        >
          <LineChart />
          <HandleComponent data={data} variant="accent2" />
        </div>
      </NodeWrapper>
    );
  }

  const plotData = nodeResult.result.data as OrderedPairData;
  const xs = plotData.x as number[];
  const ys = plotData.y as number[];
  xscale.current.domain = [Math.min(...xs), Math.max(...xs)];
  yscale.current.domain = [Math.min(...ys), Math.max(...ys)];

  cg.clear(theme.bg);

  cg.render(coords.current, viewport, [
    new LineStrip(cg, xs, ys, {
      colors: theme.accent,
      widths: 2
    }),
    ...axes,
  ]);

  cg.copyTo(
    viewport,
    document.getElementById(`canvas-${id}`) as HTMLCanvasElement,
  );

  return (
    <NodeWrapper nodeError={nodeError}>
      <div
        className={clsx(
          "rounded-2xl bg-transparent",
          { "shadow-around shadow-accent2": selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <canvas
          id={`canvas-${id}`}
          style={{ boxShadow: "0px 0px 2px #ccc" }}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
        />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default LineNode;
