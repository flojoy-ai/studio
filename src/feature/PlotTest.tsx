import { Plot } from "@src/lib/plot";
import { Sphere } from "@src/lib/plot/sphere";
import { useRef } from "react";

export const PlotTest = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  if (canvas.current) {
    const plot = new Plot({
      ref: canvas.current,
      width: 800,
      height: 800,
    });

    const sphere = new Sphere(plot, {
      radius: 0.5,
      center: [0, 0, 0],
    });

    sphere.draw();
  }

  return (
    <div>
      <canvas ref={canvas} id="test-canvas" width={200} height={200} />
    </div>
  );
};
