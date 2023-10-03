import { useEffect, useRef } from "react";
import { Vec3 } from "regl";
import { ScatterPlot3D } from "@src/lib/plot/plots/3d/scatter";

const data: Vec3[] = Array(1000)
  .fill(undefined)
  .map(() => [Math.random() * 5, Math.random() * 5, Math.random() * 5]);

export const PlotTest = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const scatter = useRef<ScatterPlot3D | null>(null);

  useEffect(() => {
    if (canvas.current) {
      scatter.current = new ScatterPlot3D(canvas.current, data);
      scatter.current.frame();
    }
  }, [canvas.current]);

  return (
    <div>
      <canvas ref={canvas} id="test-canvas" width={800} height={800} />
    </div>
  );
};
