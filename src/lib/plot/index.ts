import REGL from "regl";
import { Triangle } from "./triangle";

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
  private width: number;
  private height: number;

  constructor({ width, height, ref }: PlotOptions) {
    this.reglContext = REGL(ref);
    this.width = width;
    this.height = height;
  }

  public get regl() {
    return this.reglContext;
  }
}

export { Triangle };
