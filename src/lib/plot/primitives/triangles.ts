import { DrawCommand, Vec3, Vec4 } from "regl";
import { Drawable } from "../types";
import { Plot } from "..";

type Props = {
  vertices: Vec3[];
  color: Vec4;
  count?: number;
};

type Attributes = {
  position: Vec3[];
};

type Uniforms = {
  color: Vec4;
};

export class Triangles implements Drawable {
  private readonly drawCommand: DrawCommand;
  private props: Props;

  constructor(plot: Plot, props: Props) {
    this.props = props;
    if (!props.count) {
      this.props.count = props.vertices.length;
    }

    this.drawCommand = plot.regl<Uniforms, Attributes>({
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
        position: plot.regl.prop<Props, keyof Props>("vertices"),
      },

      uniforms: {
        color: plot.regl.prop<Props, keyof Props>("color"),
      },

      count: plot.regl.prop<Props, keyof Props>("color"),
    });
  }

  public draw() {
    this.drawCommand(this.props);
  }
}
