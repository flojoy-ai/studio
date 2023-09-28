import REGL from "regl";
import createCamera from "./camera";
import { Triangle } from "./triangle";
import { Sphere } from "./sphere";
import { Points } from "./points";
import { OrthogonalPlane } from "./plane";

export interface Drawable {
  draw: REGL.DrawCommand;
}

type CameraOptions = {
  center: REGL.Vec3;
};

export class Plot {
  public readonly regl: REGL.Regl;
  private camera?: (block) => void;

  private objects: Drawable[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.regl = REGL(canvas);
    this.camera = undefined;
    this.objects = [];
  }

  public with(obj: Drawable) {
    this.objects.push(obj);

    return this;
  }

  public withCamera({ center }: CameraOptions) {
    this.camera = createCamera(this.regl, {
      center,
    });

    return this;
  }

  public draw() {
    this.objects.forEach((c) => {
      c.draw();
    });
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
      return;
    }

    this.regl.frame(() => {
      this.regl.clear({
        color: [0, 0, 0, 1],
      });

      this.draw();
    });
  }
}

export { Triangle, Sphere, Points, OrthogonalPlane };
