import { DrawCommand, Regl, Vec3, Vec4 } from "regl";
import { Drawable } from "../types";

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
  gridSize: number;
  orientation: "xz" | "xy" | "yz";
};

export class OrthogonalPlane implements Drawable {
  private readonly drawCommand: DrawCommand;
  private readonly vertices: Vec3[];
  public color: Vec4;

  constructor(
    regl: Regl,
    options: OrthogonalPlaneOptions,
    props: Partial<Omit<Props, "vertices">>,
  ) {
    this.vertices = this.createVertices(options);
    this.color = props.color ?? [0.5, 0.5, 0.5, 1];

    this.drawCommand = regl<Uniforms, Attributes>({
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
        position: regl.prop<Props, keyof Props>("vertices"),
      },
      uniforms: {
        color: regl.prop<Props, keyof Props>("color"),
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

  private createXZPlaneVertices({
    gridSize: size,
  }: OrthogonalPlaneOptions): Vec3[] {
    const vertices: Vec3[] = [];

    for (let i = 0; i < size; i++) {
      vertices.push([i, 0, 0]);
      vertices.push([i, 0, size]);
    }

    for (let i = 0; i < size; i++) {
      vertices.push([0, 0, i]);
      vertices.push([size, 0, i]);
    }

    return vertices;
  }
}
