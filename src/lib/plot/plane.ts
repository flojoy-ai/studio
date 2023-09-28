import REGL from "regl";
import { Drawable, Plot } from ".";

type Uniforms = {
  color: REGL.Vec4;
};

type Attributes = {
  position: REGL.Vec3[];
};

type OrthogonalPlaneOptions = {
  gridSize: number;
  orientation: "xz" | "xy" | "yz";
};

export class OrthogonalPlane implements Drawable {
  public readonly render: REGL.DrawCommand;
  private readonly regl: REGL.Regl;
  private readonly vertices: REGL.Vec3[];

  constructor(plot: Plot, options: OrthogonalPlaneOptions) {
    this.regl = plot.regl;
    this.vertices = this.createVertices(options);

    this.render = this.regl<Uniforms, Attributes>({
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
        position: this.vertices,
      },
      uniforms: {
        color: [0.5, 0.5, 0.5, 1],
      },
      count: this.vertices.length,
      primitive: "lines",
    });
  }

  public draw() {
    this.render();
  }

  private createVertices(options: OrthogonalPlaneOptions): REGL.Vec3[] {
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

  private createXZPlaneVertices(options: OrthogonalPlaneOptions): REGL.Vec3[] {
    const vertices: REGL.Vec3[] = [];
    const size = options.gridSize;

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
