import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo, useRef } from "react";
import { OrthogonalPlane, Plot, Points } from "@src/lib/plot";
import REGL from "regl";

const points: REGL.Vec3[] = Array(1000)
  .fill(undefined)
  .map(() => [Math.random() * 8, Math.random() * 8, Math.random() * 8]);

const Scatter3DNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const plot = useRef<Plot | null>(null);

  if (canvas.current && !plot.current) {
    const plt = new Plot({
      ref: canvas.current,
      cameraOptions: {
        center: [0, 0, 0],
      },
    });
    plot.current = plt;

    plt.addObject(
      new Points(plt, points, {
        pointSize: 5,
      }),
    );
    plt.addObject(
      new OrthogonalPlane(plt, { orientation: "xy", gridSize: 10 }),
    );
    plt.addObject(
      new OrthogonalPlane(plt, { orientation: "xz", gridSize: 10 }),
    );
    plt.addObject(
      new OrthogonalPlane(plt, { orientation: "yz", gridSize: 10 }),
    );
    plt.frame();
  }

  return (
    <NodeWrapper nodeError={nodeError} className="nodrag">
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
