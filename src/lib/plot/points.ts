import REGL from "regl";
import { Drawable, Plot } from ".";

type Uniforms = {
  size: number;
};

type Attributes = {
  position: REGL.Vec3[];
};

type PointsOptions = {
  pointSize: number;
};

export class Points implements Drawable {
  public readonly render: REGL.DrawCommand;
  private readonly regl: REGL.Regl;
  private readonly points: REGL.Vec3[];

  constructor(plot: Plot, points: REGL.Vec3[], options: PointsOptions) {
    this.regl = plot.regl;
    this.points = points;

    this.render = this.regl<Uniforms, Attributes>({
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

        uniform mat4 view, projection;
        uniform float size;

        varying vec4 v_color;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_PointSize = size;
          gl_Position = projection * view * pos;
          v_color = pos; 
        }
      `,
      attributes: {
        position: this.points,
      },

      uniforms: {
        size: options.pointSize,
      },

      count: this.points.length,
      primitive: "points",
    });
  }

  public draw() {
    this.render();
  }
}
