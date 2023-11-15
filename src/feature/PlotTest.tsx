import { useEffect, useRef } from "react";
import { Vec3 } from "regl";
import { ScatterPlot3D } from "@src/lib/plot/plots/3d/scatter";

const data: Vec3[] = Array(1000)
  .fill(undefined)
  .map(() => [Math.random() * 10, Math.random() * 10, Math.random() * 10]);

export const PlotTest = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const scatter = useRef<ScatterPlot3D | null>(null);

  useEffect(() => {
    if (canvas.current) {
      scatter.current = new ScatterPlot3D(canvas.current, data, {
        axes: {
          x: {
            domain: [-10, 10],
            step: 0.5,
          },
          y: {
            domain: [-10, 10],
            step: 0.5,
          },
          z: {
            domain: [-10, 10],
            step: 0.5,
          },
        },
      });
      scatter.current.frame();
    }
  }, []);

  return (
    <div>
      <div className="mt-8 flex gap-2">
        <canvas ref={canvas} width={800} height={800} />
      </div>
    </div>
  );
};
