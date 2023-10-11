import { Vec3, DrawCommand, Vec4 } from "regl";
import { Drawable } from "../types";
import { Plot } from "../plot";

const DEFAULT_COLOR = [0.6, 0.96, 1, 1];

type Props = {
  points: Vec3[];
  count: number;
  colors?: Vec4 | Vec4[];
};

type Uniforms = {
  size: number;
};

type Attributes = {
  position: Vec3[];
  color: Vec4 | Vec4[];
};

type PointsOptions = {
  pointSize: number;
};

// TODO: Make this scale better with small values
export class Points implements Drawable {
  private readonly drawCommand: DrawCommand;
  private points: Vec3[];
  private count: number;
  private colors?: Vec4 | Vec4[];

  constructor(
    plot: Plot,
    options: PointsOptions,
    initialProps: Omit<Props, "count">,
  ) {
    this.points = initialProps.points;
    this.count = initialProps.points.length;
    this.colors = initialProps.colors;
    this.drawCommand = plot.regl<Uniforms, Attributes>({
      frag: `
        precision mediump float;
        varying vec4 v_color;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) {
            discard;
          }
          gl_FragColor = v_color;
        }
      `,
      vert: `
        precision mediump float;

        attribute vec3 position;
        attribute vec4 color;

        uniform mat4 view, projection;
        uniform float size;

        varying vec4 v_color;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_PointSize = size;
          gl_Position = projection * view * pos;
          v_color = color;
        }
      `,
      attributes: {
        position: plot.regl.prop<Props, keyof Props>("points"),
        color: plot.regl.prop<Props, keyof Props>("colors"),
      },

      uniforms: {
        size: options.pointSize,
      },

      count: plot.regl.prop<Props, keyof Props>("count"),
      primitive: "points",
    });
  }

  public updateData(data: Vec3[], colors?: Vec4 | Vec4[]) {
    this.points = data;
    this.count = data.length;
    if (colors) {
      this.colors = colors;
    }
  }

  public draw() {
    this.drawCommand({
      points: this.points,
      count: this.count,
      colors: this.colors ?? DEFAULT_COLOR,
    });
  }
}
