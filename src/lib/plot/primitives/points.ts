import { Vec3, DrawCommand } from "regl";
import { Drawable } from "../types";
import { Plot } from "../plot";

type Props = {
  points: Vec3[];
  count: number;
};

type Uniforms = {
  size: number;
};

type Attributes = {
  position: Vec3[];
};

type PointsOptions = {
  pointSize: number;
};

export class Points implements Drawable {
  private readonly drawCommand: DrawCommand;
  private props: Props;

  constructor(plot: Plot, options: PointsOptions, initialProps: Props) {
    this.props = initialProps;
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
        position: plot.regl.prop<Props, keyof Props>("points"),
      },

      uniforms: {
        size: options.pointSize,
      },

      count: plot.regl.prop<Props, keyof Props>("count"),
      primitive: "points",
    });
  }

  public setProps(props: Props) {
    this.props = props;
  }

  public draw() {
    this.drawCommand(this.props);
  }
}
