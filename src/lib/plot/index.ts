import REGL from "regl";
import { Triangle } from "./triangle";
import { Sphere } from "./sphere";
import { Points } from "./points";

export interface Drawable {
  render(): void;
}

type PlotOptions = {
  width: number;
  height: number;
  ref: HTMLCanvasElement;
};

export class Plot {
  private reglContext: REGL.Regl;

  constructor({ ref }: PlotOptions) {
    this.reglContext = REGL(ref);
  }

  public get regl() {
    return this.reglContext;
  }
}

export { Triangle, Sphere, Points };
