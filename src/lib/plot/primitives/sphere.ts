import { Vec3, DrawCommand } from "regl";
import { Drawable } from "../types";
import { Plot } from "..";

type Props = {
  vertices: Vec3[];
};

type Attributes = {
  position: Vec3[];
};

type SphereOptions = {
  radius: number;
  center: Vec3;
  nStacks?: number;
  nSectors?: number;
};

export class Sphere implements Drawable {
  private readonly drawCommand: DrawCommand;
  private props: Props;

  constructor(plot: Plot, options: SphereOptions) {
    this.props = {
      vertices: this.createVertices(options),
    };

    this.drawCommand = plot.regl<Record<string, never>, Attributes>({
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
        varying vec4 v_color;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_PointSize = 2.0;
          gl_Position = projection * view * pos;
          v_color = pos; 
        }
      `,
      attributes: {
        position: plot.regl.prop<Props, keyof Props>("vertices"),
      },

      count: this.props.vertices.length,
      primitive: "points",
    });
  }

  public draw() {
    this.drawCommand(this.props);
  }

  private createVertices(options: SphereOptions) {
    const { radius, center, nStacks = 180, nSectors = 360 } = options;
    const dPhi = Math.PI / nStacks;
    const dTheta = (2 * Math.PI) / nSectors;

    const vertices: Vec3[] = [];

    for (let i = 0; i < nStacks; i++) {
      const phi = i * dPhi;

      for (let j = 0; j < nSectors; j++) {
        const theta = j * dTheta;

        const x = Math.sin(phi) * Math.cos(theta) * radius + center[0];
        const y = Math.sin(phi) * Math.sin(theta) * radius + center[1];
        const z = Math.cos(phi) * radius + center[2];

        vertices.push([x, y, z]);
      }
    }

    return vertices;
  }
}
