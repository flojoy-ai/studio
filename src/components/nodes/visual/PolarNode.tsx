
import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { OrderedPairData } from "@src/feature/common/types/ResultsType";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import {
  LineSegments,
  LineStrip,
  LinearScale,
  PolarCoordinateSystem,
  Text
} from "candygraph";
import Scatter from "@src/assets/nodes/Scatter";
import { useCandyGraph } from "@src/hooks/useCandyGraph";
import { useTheme } from "@src/providers/themeProvider";
import {
  PLOT_HEIGHT,
  PLOT_WIDTH,
  darkTheme,
  lightTheme,
} from "./plotConstants";

const dpr = window.devicePixelRatio;
const viewport = { x: 0, y: 0, width: 384 * dpr, height: 384 * dpr };

const PolarNode = ({ data, selected, id }: CustomNodeProps) => {
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

  if (!font) {
    throw new Error("Failed to load plot font")
  }

  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  const plotData = nodeResult.result.data as OrderedPairData;
  const xs = plotData.x as number[];
  const ys = plotData.y as number[];

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);


  // Generate some polar data.
  const rhos: number[] = [];
  const thetas: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];

    rhos.push(Math.sqrt(x * x + y * y));
    thetas.push(Math.atan2(y, x));
  }

  // Scale the canvas by the device pixel ratio.
  const canvas = document.getElementById("ex-00900") as HTMLCanvasElement;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.width *= dpr;
  canvas.height *= dpr;

  // Create a viewport. Units are in pixels.

  // Create a polar coordinate system. The first two scales map input data to
  // polar distance and angle (in radians), the next two map the resulting
  // cartesian coordinates to pixels.
  const coords = new PolarCoordinateSystem(
    cg,
    new LinearScale([0, 1], [0, 1]), // radial scale
    new LinearScale([0, 1], [0, 1]), // angular scale
    new LinearScale([-1.1, 1.1], [16 * dpr, viewport.width - 16 * dpr]), // x scale
    new LinearScale([-1.1, 1.1], [16 * dpr, viewport.height - 16 * dpr]) // y scale
  );

  // Clear the viewport.
  cg.clear([1, 1, 1, 1]);

  // Create axis tick marks, labels, and radial grid lines.
  const axisLinePositions: number[] = [];
  const axisLineWidths: number[] = [];
  const axisLineColors: number[] = [];
  const axisLabels: Text[] = [];
  for (let turn = 0; turn < 1.0; turn += 20 / 360) {
    const theta = turn * 2 * Math.PI;
    axisLinePositions.push(0, theta, 1.0, theta);
    axisLineWidths.push(1 * dpr);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
    axisLinePositions.push(0.93, theta, 1.0, theta);
    axisLineWidths.push(2 * dpr);
    axisLineColors.push(0, 0, 0, 1.0);
    for (let i = 1; i <= 9; i++) {
      const phi = theta + (i * 2 * 2 * Math.PI) / 360;
      axisLinePositions.push(0.95, phi, 1.0, phi);
      axisLineWidths.push(1.0 * dpr);
      axisLineColors.push(0, 0, 0, 1.0);
    }
    axisLabels.push(
      new Text(cg, font, Math.round(turn * 360).toString(), [1.05, theta], {
        anchor: turn < 0.25 || turn > 0.75 ? [-1, 0] : [1, 0],
        angle: turn < 0.25 || turn > 0.75 ? theta : theta + Math.PI,
        size: 12 * dpr,
      })
    );
  }

  // Create the circular grid lines.
  for (let turn = 0; turn < 1.0; turn += 0.001) {
    const theta0 = (turn + 0.0) * 2 * Math.PI;
    const theta1 = (turn + 0.001) * 2 * Math.PI;
    axisLinePositions.push(1.0, theta0, 1.0, theta1);
    axisLineWidths.push(1.0 * dpr);
    axisLineColors.push(0, 0, 0, 1.0);
    axisLinePositions.push(0.25, theta0, 0.25, theta1);
    axisLineWidths.push(1.0 * dpr);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
    axisLinePositions.push(0.5, theta0, 0.5, theta1);
    axisLineWidths.push(1.0 * dpr);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
    axisLinePositions.push(0.75, theta0, 0.75, theta1);
    axisLineWidths.push(1.0 * dpr);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
  }

  // Render the a line strip representing the polar data.
  cg.render(coords, viewport, [
    new LineSegments(cg, axisLinePositions, {
      widths: axisLineWidths,
      colors: axisLineColors,
    }),
    ...axisLabels,
    new LineStrip(cg, rhos, thetas, {
      colors: [1, 0.5, 0, 1],
      widths: 2.5 * dpr,
    }),
  ]);

  // Copy the plot to a new canvas and add it to the document.
  cg.copyTo(viewport, document.getElementById("ex-00900") as HTMLCanvasElement);


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
          style={{ boxShadow: "0px 0px 2px #ccc" }}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
        />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default PolarNode;
