import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { OrderedPairData } from "@src/feature/common/types/ResultsType";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import {
  CartesianCoordinateSystem,
  Circles,
  LinearScale,
  OrthoAxis,
} from "candygraph";
import Scatter from "@src/assets/nodes/Scatter";
import { useCandyGraph } from "@src/hooks/useCandyGraph";
import { useTheme } from "@src/providers/themeProvider";
import { PLOT_HEIGHT, PLOT_WIDTH, darkTheme, lightTheme } from "./plotConstants";

const viewport = { x: 0, y: 0, width: PLOT_WIDTH, height: PLOT_HEIGHT };
const dpr = window.devicePixelRatio;

const ScatterNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);
  const { resolvedTheme } = useTheme();
  const { cg, font } = useCandyGraph({
    width: viewport.width,
    height: viewport.height,
  });

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
          <Scatter />
          <HandleComponent data={data} variant="accent2" />
        </div>
      </NodeWrapper>
    );
  }

  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  const plotData = nodeResult.result.data as OrderedPairData;
  const x = plotData.x as number[];
  const y = plotData.y as number[];

  const xMin = Math.min(...x);
  const xMax = Math.max(...x);
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const xscale = new LinearScale([xMin, xMax], [32, viewport.width - 16]);
  const yscale = new LinearScale([yMin, yMax], [32, viewport.height - 16]);

  const coords = new CartesianCoordinateSystem(cg, xscale, yscale);

  cg.clear(theme.bg);

  const axes = font
    ? [
        new OrthoAxis(cg, coords, "x", font, {
          labelSide: 1,
          tickStep: Math.pow(10, Math.round(Math.log10(xMax - xMin)) - 1),
          tickOffset: -2,
          axisColor: [0.5, 0.5, 0.5, 1],
          tickColor: [0.5, 0.5, 0.5, 1],
        }),
        new OrthoAxis(cg, coords, "y", font, {
          tickStep: Math.pow(10, Math.round(Math.log10(yMax - yMin)) - 1),
          tickOffset: 2,
          axisColor: [0.5, 0.5, 0.5, 1],
          tickColor: [0.5, 0.5, 0.5, 1],
        }),
      ]
    : [];

  cg.render(coords, viewport, [
    new Circles(cg, x, y, {
      colors: theme.accent,
      radii: 3 * dpr,
      borderWidths: 0,
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
          { "shadow-around shadow-accent2": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <canvas
          id={`canvas-${id}`}
          style={{ boxShadow: "0px 0px 8px #ccc;" }}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
        />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default ScatterNode;
