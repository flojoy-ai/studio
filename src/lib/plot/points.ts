import REGL from "regl";
import { Drawable } from ".";

type Uniforms = {
  size: number;
};

type Attributes = {
  position: REGL.Buffer;
};

type PointsOptions = {
  points: REGL.Buffer;
  pointCount: number;
  pointSize: number;
};

export class Points implements Drawable {
  private vertices: REGL.Buffer;
  private vertexCount: number;
  public draw: REGL.DrawCommand;

  set points(value: REGL.Buffer) {
    this.vertices = value;
  }

  set pointCount(value: number) {
    this.vertexCount = value;
  }

  constructor(regl: REGL.Regl, options: PointsOptions) {
    this.vertices = options.points;
    this.vertexCount = options.pointCount;
    this.draw = regl<Uniforms, Attributes>({
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
        position: regl.this("vertices"),
      },

      uniforms: {
        size: options.pointSize,
      },

      count: regl.this("vertexCount"),
      primitive: "points",
    });
  }

  public se;

  public render() {
    this.draw();
  }
}
