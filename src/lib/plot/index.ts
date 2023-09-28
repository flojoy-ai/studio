import REGL from "regl";
import { Triangle } from "./triangle";
import { Sphere } from "./sphere";
import { Points } from "./points";
import createCamera from "./camera";
import { OrthogonalPlane } from "./plane";

export interface Drawable {
  render(): void;
}

type PlotOptions = {
  ref: HTMLCanvasElement;
  cameraOptions?: {
    center: REGL.Vec3;
  };
};

export class Plot {
  public readonly regl: REGL.Regl;
  private readonly camera?: (block) => void;

  private objects: Drawable[];

  constructor({ ref, cameraOptions }: PlotOptions) {
    this.regl = REGL(ref);
    this.camera = cameraOptions
      ? createCamera(this.regl, cameraOptions)
      : undefined;
    this.objects = [];
  }

  public addObject(obj: Drawable) {
    this.objects.push(obj);
  }

  public draw() {
    this.objects.forEach((o) => o.render());
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
