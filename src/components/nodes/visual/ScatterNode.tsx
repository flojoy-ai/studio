import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { OrderedPairData } from "@src/feature/common/types/ResultsType";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo } from "react";
import {
  CartesianCoordinateSystem,
  Circles,
  LinearScale,
  OrthoAxis,
  // OrthoAxis,
  // createDefaultFont,
} from "candygraph";
import Scatter from "@src/assets/nodes/Scatter";
import { useCandyGraph } from "@src/hooks/useCandyGraph";

type Color = [number, number, number, number];

const viewport = { x: 0, y: 0, width: 360, height: 224 };
const dpr = window.devicePixelRatio;

const bgColor: Color = [0.05, 0.05, 0.05, 1];
const accentColor: Color = [0.598, 0.957, 1, 1];

const ScatterNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);
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

  const plotData = nodeResult.result.data as OrderedPairData;
  const x = plotData.x as number[];
  const y = plotData.y as number[];
  const xMin = Math.min(...x);
  const yMin = Math.min(...y);
  const xMax = Math.max(...x);
  const yMax = Math.max(...y);

  const xscale = new LinearScale([xMin, xMax], [16, viewport.width - 16]);
  const yscale = new LinearScale([yMin, yMax], [16, viewport.height - 16]);

  const coords = new CartesianCoordinateSystem(cg, xscale, yscale);

  cg.clear(bgColor);

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
      colors: accentColor,
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
          width={360}
          height={224}
        />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(ScatterNode);
