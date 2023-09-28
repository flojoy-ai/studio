import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo, useRef } from "react";
import { Plot, OrthogonalPlane, Points } from "@src/lib/plot";
import REGL from "regl";

const pointData: REGL.Vec3[] = Array(1000)
  .fill(undefined)
  .map(() => [Math.random() * 8, Math.random() * 8, Math.random() * 8]);

const Scatter3DNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const plot = useRef<Plot | null>(null);

  if (canvas.current && !plot.current) {
    const plt = new Plot(canvas.current)
      .with(Points(pointData, { pointSize: 5 }))
      .with(OrthogonalPlane({ orientation: "xy", gridSize: 10 }))
      .with(OrthogonalPlane({ orientation: "xz", gridSize: 10 }))
      .with(OrthogonalPlane({ orientation: "yz", gridSize: 10 }))
      .withCamera({ center: [2.5, 2.5, 2.5] });
    plot.current = plt;

    plt.frame();
  }

  return (
    <NodeWrapper nodeError={nodeError}>
      <div
        className={clsx(
          "rounded-2xl bg-transparent",
          { "shadow-around shadow-accent2": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <canvas ref={canvas} id={`canvas-${id}`} width={360} height={224} />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(Scatter3DNode);
