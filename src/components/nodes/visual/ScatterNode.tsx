import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { OrderedPairData } from "@src/feature/common/types/ResultsType";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo } from "react";
import CandyGraph, {
  CartesianCoordinateSystem,
  Circles,
  LinearScale,
} from "candygraph";
import Scatter from "@src/assets/nodes/Scatter";

const ScatterNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);

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

  const cg = new CandyGraph();
  const dpr = window.devicePixelRatio;
  cg.canvas.width = 360;
  cg.canvas.height = 224;
  const viewport = { x: 0, y: 0, width: 360, height: 224 };

  const xscale = new LinearScale(
    [Math.min(...x), Math.max(...x)],
    [0, viewport.width],
  );

  const yscale = new LinearScale(
    [Math.min(...y), Math.max(...y)],
    [0, viewport.height],
  );

  const coords = new CartesianCoordinateSystem(cg, xscale, yscale);

  cg.clear([1, 1, 1, 1]);

  cg.render(coords, viewport, [
    new Circles(cg, x, y, {
      colors: [0, 0, 1, 1],
      radii: 3 * dpr,
      borderWidths: 0,
    }),
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
