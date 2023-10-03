import { Vec3, Vec4 } from "regl";
import { Plot } from "../../plot";
import { OrthogonalPlane, Points } from "../../primitives";
import { Axis } from "../../types";

type ScatterPlot3DOptions = {
  backgroundColor?: Vec4;
  axes?: {
    x: Axis;
    y: Axis;
    z: Axis;
  };
};

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
      { pointSize: 5 },
      {
        points: data,
        count: data.length,
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

    this.plot
      .with([
        this.points,
        new OrthogonalPlane(this.plot, {
          orientation: "xz",
          axes: [x, z],
        }),
        new OrthogonalPlane(this.plot, {
          orientation: "xy",
          axes: [x, y],
        }),
        new OrthogonalPlane(this.plot, {
          orientation: "yz",
          axes: [y, z],
        }),
      ])
      .withCamera({
        center: [2.5, 2.5, 2.5],
      });
  }

  public draw() {
    this.plot.draw();
  }

  public frame() {
    this.plot.frame();
  }

  public updateData(data: Vec3[]) {
    this.points.setProps({
      points: data,
      count: data.length,
    });
  }
}
