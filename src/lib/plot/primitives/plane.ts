import { DrawCommand, Vec3, Vec4 } from "regl";
import { Axis, Drawable } from "../types";
import { Plot } from "../plot";

type Props = {
  vertices: Vec3[];
  color: Vec4;
};

type Uniforms = {
  color: Vec4;
};

type Attributes = {
  position: Vec3[];
};

type OrthogonalPlaneOptions = {
  orientation: "xz" | "xy" | "yz";
  axes: [Axis, Axis];
};

export class OrthogonalPlane implements Drawable {
  private readonly drawCommand: DrawCommand;
  private readonly vertices: Vec3[];
  public color: Vec4;

  constructor(
    plot: Plot,
    options: OrthogonalPlaneOptions,
    props?: Partial<Omit<Props, "vertices">>,
  ) {
    this.vertices = this.createVertices(options);
    this.color = props?.color ?? [0.5, 0.5, 0.5, 1];

    this.drawCommand = plot.regl<Uniforms, Attributes>({
      frag: `
        precision mediump float;

        uniform vec4 color;

        void main() {
          gl_FragColor = color; 
        }
      `,
      vert: `
        precision mediump float;

        attribute vec3 position;

        uniform mat4 view, projection;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_Position = projection * view * pos;
        }
      `,
      attributes: {
        position: plot.regl.prop<Props, keyof Props>("vertices"),
      },
      uniforms: {
        color: plot.regl.prop<Props, keyof Props>("color"),
      },
      count: this.vertices.length,
      primitive: "lines",
    });
  }

  public draw() {
    this.drawCommand({
      vertices: this.vertices,
      color: this.color,
    });
  }

  private createVertices(options: OrthogonalPlaneOptions): Vec3[] {
    const vertices = this.createXZPlaneVertices(options);
    switch (options.orientation) {
      case "xz":
        return vertices;
      case "xy":
        return vertices.map((v) => [v[0], v[2], v[1]]);
      case "yz":
        return vertices.map((v) => [v[1], v[0], v[2]]);
    }
  }

  private createXZPlaneVertices(options: OrthogonalPlaneOptions): Vec3[] {
    const [a, b] = options.axes;
    const { domain: aDomain, step: aStep } = a;
    const { domain: bDomain, step: bStep } = b;
    const [a1, a2] = aDomain;
    const [b1, b2] = bDomain;

    const vertices: Vec3[] = [];

    for (let i = a1; i <= a2; i += aStep) {
      vertices.push([i, 0, b1]);
      vertices.push([i, 0, b2]);
    }

    for (let i = b1; i <= b2; i += bStep) {
      vertices.push([a1, 0, i]);
      vertices.push([a2, 0, i]);
    }

    return vertices;
  }
}
