import REGL from "regl";
import { Drawable } from ".";

type Props = {
  points: REGL.Vec3[];
  pointCount: number;
};

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
  private props: Props;
  public draw: REGL.DrawCommand;

  constructor(regl: REGL.Regl, options: PointsOptions, initialProps: Props) {
    this.props = initialProps;
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
        position: regl.prop<Props, keyof Props>("points"),
      },

      uniforms: {
        size: options.pointSize,
      },

      count: regl.prop<Props, keyof Props>("pointCount"),
      primitive: "points",
    });
  }

  public setProps(props: Props) {
    this.props = props;
  }

  public render() {
    console.log(this.props);
    this.draw(this.props);
  }
}
