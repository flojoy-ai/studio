import REGL from "regl";
import { Drawable, Plot } from ".";

type Uniforms = {
  color: REGL.Vec4;
};

type Attributes = {
  position: REGL.Vec2[];
};

type TriangleOptions = {
  vertices: REGL.Vec2[];
};

export class Triangle implements Drawable {
  public readonly draw: REGL.DrawCommand;

  constructor(plot: Plot, options: TriangleOptions) {
    const regl = plot.regl;
    this.draw = regl<Uniforms, Attributes>({
      frag: `
        precision mediump float;
        uniform vec4 color;
        varying vec4 v_color;

        void main() {
          gl_FragColor = v_color; 
        }
      `,
      vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec4 v_color;

        void main() {
          vec4 pos = vec4(position, 0, 1);
          gl_Position = pos;
          v_color = pos;
        }
      `,
      attributes: {
        position: options.vertices,
      },

      uniforms: {
        color: regl.prop<Uniforms, keyof Uniforms>("color"),
      },

      count: 3,
    });
  }

  render() {
    this.draw({
      color: [1, 0, 0, 1],
    });
  }
}
