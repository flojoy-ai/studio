import { Vec3, DrawCommand, Vec4 } from "regl";
import { Drawable } from "../types";
import { Plot } from "../plot";

type Props = {
  points: Vec3[];
  count: number;
  color?: Vec4;
};

type Uniforms = {
  size: number;
  color: Vec4;
};

type Attributes = {
  position: Vec3[];
};

type PointsOptions = {
  pointSize: number;
};

export class Points implements Drawable {
  private readonly drawCommand: DrawCommand;
  private points: Vec3[];
  private count: number;
  private color?: Vec4;

  constructor(
    plot: Plot,
    options: PointsOptions,
    initialProps: Omit<Props, "count">,
  ) {
    this.points = initialProps.points;
    this.count = initialProps.points.length;
    this.color = initialProps.color;
    this.drawCommand = plot.regl<Uniforms, Attributes>({
      frag: `
        precision mediump float;
        uniform vec4 color;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) {
            discard;
          }
          gl_FragColor = color;
        }
      `,
      vert: `
        precision mediump float;

        attribute vec3 position;

        uniform mat4 view, projection;
        uniform float size;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_PointSize = size;
          gl_Position = projection * view * pos;
        }
      `,
      attributes: {
        position: plot.regl.prop<Props, keyof Props>("points"),
      },

      uniforms: {
        size: options.pointSize,
        color: plot.regl.prop<Props, keyof Props>("color"),
      },

      count: plot.regl.prop<Props, keyof Props>("count"),
      primitive: "points",
    });
  }

  public updateData(data: Vec3[]) {
    this.points = data;
    this.count = data.length;
  }

  public draw() {
    this.drawCommand({
      points: this.points,
      count: this.count,
      color: this.color ?? [1, 0, 0, 1],
    });
  }
}
