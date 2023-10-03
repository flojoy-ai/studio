import { Vec3, Vec4 } from "regl";
import { Plot } from "../../plot";
import { OrthogonalPlane, Points } from "../../primitives";

export class ScatterPlot3D {
  private plot: Plot;
  private points: Points;

  constructor(canvas: HTMLCanvasElement, data: Vec3[], backgroundColor?: Vec4) {
    this.plot = new Plot(canvas, backgroundColor);
    this.points = new Points(
      this.plot,
      { pointSize: 5 },
      {
        points: data,
        count: data.length,
      },
    );
    this.plot
      .with([
        this.points,
        new OrthogonalPlane(this.plot, {
          orientation: "xy",
        }),
        new OrthogonalPlane(this.plot, {
          orientation: "xz",
        }),
        new OrthogonalPlane(this.plot, {
          orientation: "yz",
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
