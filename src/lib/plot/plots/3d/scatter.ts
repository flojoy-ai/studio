import { Vec3, Vec4 } from "regl";
import { Plot } from "../../plot";
import { OrthogonalPlane, Points } from "../../primitives";
import { Axis, Drawable } from "../../types";
import { CameraOptions } from "../../camera";

const point3dAverage = (points: Vec3[]): Vec3 => {
  const n = points.length;
  const res = [0, 0, 0];

  for (const p of points) {
    res[0] += p[0];
    res[1] += p[1];
    res[2] += p[2];
  }

  return [res[0] / n, res[1] / n, res[2] / n];
};

type ScatterPlot3DOptions = Partial<{
  pointSize: number;
  colors: Vec4 | Vec4[];
  backgroundColor: Vec4;
  axes: {
    x: Axis;
    y: Axis;
    z: Axis;
  };
  showPlanes: {
    xy?: boolean;
    xz?: boolean;
    yz?: boolean;
  };
  cameraOptions: CameraOptions;
}>;

export class ScatterPlot3D {
  private plot: Plot;
  private points: Points;

  constructor(
    canvas: HTMLCanvasElement,
    data: Vec3[],
    options: ScatterPlot3DOptions,
  ) {
    this.plot = new Plot(canvas, options);
    this.points = new Points(
      this.plot,
      { pointSize: options.pointSize ?? 5 },
      {
        points: data,
        colors: options.colors,
      },
    );

    const { x, y, z } = options.axes ?? {
      x: {
        domain: [0, 10],
        step: 1,
      },
      y: {
        domain: [0, 10],
        step: 1,
      },
      z: {
        domain: [0, 10],
        step: 1,
      },
    };

    const showPlanes = options.showPlanes ?? {
      xy: true,
      xz: true,
      yz: true,
    };

    const objects: Drawable[] = [this.points];
    if (showPlanes.xy) {
      objects.push(
        new OrthogonalPlane(this.plot, {
          orientation: "xy",
          axes: [x, y],
        }),
      );
    }
    if (showPlanes.xz) {
      objects.push(
        new OrthogonalPlane(this.plot, {
          orientation: "xz",
          axes: [x, z],
        }),
      );
    }
    if (showPlanes.yz) {
      objects.push(
        new OrthogonalPlane(this.plot, {
          orientation: "yz",
          axes: [y, z],
        }),
      );
    }

    this.plot.with(objects).withCamera({
      center: point3dAverage(data),
      ...options.cameraOptions,
    });
  }

  public draw() {
    this.plot.draw();
  }

  public frame() {
    this.plot.frame();
  }

  public updateData(data: Vec3[], colors?: Vec4 | Vec4[]) {
    this.points.updateData(data, colors);
  }

  public destroy() {
    this.plot.destroy();
  }
}
