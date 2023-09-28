import { Plot, Points } from "@src/lib/plot";
import { OrthogonalPlane } from "@src/lib/plot/plane";
import { useRef } from "react";
import REGL from "regl";

const data: REGL.Vec3[] = Array(1000)
  .fill(undefined)
  .map(() => [
    Math.random() * 5 - 2.5,
    Math.random() * 5 - 2.5,
    Math.random() * 5 - 2.5,
  ]);

export const PlotTest = () => {
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
      new Points(plt, data, {
        pointSize: 3,
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
    <div>
      <canvas ref={canvas} id="test-canvas" width={800} height={800} />
    </div>
  );
};
