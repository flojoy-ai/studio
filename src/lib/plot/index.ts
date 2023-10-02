import REGL from "regl";
import createCamera from "./camera";
import { Sphere, Points, OrthogonalPlane } from "./primitives";
import { Drawable } from "./types";

type CameraOptions = {
  center: REGL.Vec3;
};

export class Plot {
  public readonly regl: REGL.Regl;
  public readonly canvas: HTMLCanvasElement;
  private camera?: (block) => void;

  private objects: Drawable[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.regl = REGL(canvas);
    this.canvas = canvas;
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
