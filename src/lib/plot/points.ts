import REGL from "regl";
import { Drawable, Plot } from ".";
import { mat4 } from "gl-matrix";

type Uniforms = {
  size: number;
  view: mat4;
  projection: mat4;
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
        view: ({ tick }) => {
          const t = 0.01 * tick;
          return mat4.lookAt(
            new Float32Array(16),
            [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
            [0, 0, 0],
            [0, 1, 0],
          );
        },
        projection: ({ viewportWidth, viewportHeight }) =>
          mat4.perspective(
            new Float32Array(16),
            Math.PI / 4,
            viewportWidth / viewportHeight,
            0.01,
            1000,
          ),
      },

      count: this.points.length,
      primitive: "points",
    });
  }

  public draw() {
    this.render();
  }
}
