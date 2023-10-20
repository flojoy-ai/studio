import REGL, { Regl, Vec4 } from "regl";
import { Camera, CameraOptions } from "./camera";
import { Drawable } from "./types";

type PlotOptions = {
  backgroundColor?: Vec4;
};

export class Plot {
  public readonly regl: Regl;
  public readonly canvas: HTMLCanvasElement;
  private readonly backgroundColor: Vec4;
  private camera?: Camera;

  private objects: Drawable[] = [];

  constructor(canvas: HTMLCanvasElement, options: PlotOptions) {
    console.log(`Instantiating plot object for canvas ${canvas.id}`)
    this.regl = REGL(canvas);
    this.canvas = canvas;
    this.backgroundColor = options.backgroundColor ?? [0.2, 0.2, 0.2, 1];
    this.camera = undefined;
    this.objects = [];
  }

  public with(obj: Drawable | Drawable[]) {
    console.log(`Adding object ${typeof obj} to ${this.canvas.id}`)
    if (Array.isArray(obj)) {
      this.objects.push(...obj);
      return this;
    }

    this.objects.push(obj);

    return this;
  }

  public withCamera(options?: CameraOptions) {
    this.camera = new Camera(this, options);

    return this;
  }

  public draw() {
    this.objects.forEach((c) => {
      c.draw();
    });
  }

  public frame() {
    console.log(`Starting frame for ${this.canvas.id}`)
    if (this.camera) {
      this.regl.frame(() => {
        this.regl.clear({
          color: this.backgroundColor,
        });

        this.camera!.drawInContext(() => {
          this.draw();
        });
      });
      return;
    }

    this.regl.frame(() => {
      this.regl.clear({
        color: this.backgroundColor,
      });

      this.draw();
    });
  }

  public destroy() {
    console.log(`Destroying plot for ${this.canvas.id}`)
    this.regl.destroy();
  }
}