import REGL from "regl";
import createCamera from "./camera";
import { Triangle } from "./triangle";
import { Sphere } from "./sphere";
import { Points } from "./points";
import { OrthogonalPlane } from "./plane";

type PlotObject = (regl: REGL.Regl) => REGL.DrawCommand;

type CameraOptions = {
  center: REGL.Vec3;
};

export class Plot {
  public readonly regl: REGL.Regl;
  private camera?: (block) => void;

  private drawCommands: REGL.DrawCommand[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.regl = REGL(canvas);
    this.camera = undefined;
    this.drawCommands = [];
  }

  public with(obj: PlotObject) {
    this.drawCommands.push(obj(this.regl));

    return this;
  }

  public withCamera({ center }: CameraOptions) {
    this.camera = createCamera(this.regl, {
      center,
    });

    return this;
  }

  public draw() {
    this.drawCommands.forEach((c) => c());
  }

  public frame() {
    if (this.camera) {
      this.regl.frame(() => {
        this.regl.clear({
          color: [0, 0, 0, 1],
        });

        this.camera!(() => {
          this.draw();
        });
      });
    } else {
      this.regl.frame(() => {
        this.regl.clear({
          color: [0, 0, 0, 1],
        });

        this.draw();
      });
    }
  }
}

export { Triangle, Sphere, Points, OrthogonalPlane };
