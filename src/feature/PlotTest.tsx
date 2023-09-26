import { Plot, Points } from "@src/lib/plot";
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

  if (canvas.current) {
    const plot = new Plot({
      ref: canvas.current,
      width: 300,
      height: 300,
    });

    const points = new Points(plot, data, {
      pointSize: 3,
    });

    points.draw();

    // const sphere = new Sphere(plot, {
    //   radius: 0.5,
    //   center: [0, 0, -2],
    // });
    //
    // sphere.draw();
  }

  return (
    <div>
      <canvas ref={canvas} id="test-canvas" width={800} height={800} />
    </div>
  );
};
