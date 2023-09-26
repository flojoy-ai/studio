import REGL from "regl";
import { Drawable, Plot } from ".";
import { mat4 } from "gl-matrix";

type Uniforms = {
  translate: mat4;
  scale: mat4;
  view: mat4;
  projection: mat4;
};

type Attributes = {
  position: REGL.Vec3[];
};

type SphereOptions = {
  radius: number;
  center: REGL.Vec3;
  nSectors?: number;
  nStacks?: number;
};

export class Sphere implements Drawable {
  public readonly render: REGL.DrawCommand;
  private readonly regl: REGL.Regl;
  private readonly vertices: REGL.Vec3[];

  constructor(plot: Plot, options: SphereOptions) {
    const { radius, center, nSectors = 360, nStacks = 180 } = options;

    this.regl = plot.regl;
    this.vertices = this.createVertices(nStacks, nSectors);
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

        uniform mat4 scale, translate, view, projection;

        varying vec4 v_color;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_PointSize = 5.0;
          gl_Position = pos;
          v_color = pos; 
        }
      `,
      attributes: {
        position: this.vertices,
      },

      uniforms: {
        translate: mat4.translate(new Float32Array(16), mat4.create(), center),
        scale: mat4.scale(new Float32Array(16), mat4.create(), [
          radius,
          radius,
          radius,
        ]),
        view: () => {
          return mat4.identity(new Float32Array(16));
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

      count: this.vertices.length,
    });
  }

  public draw() {
    this.render();
  }

  private createVertices(nStacks: number, nSectors: number) {
    const dPhi = Math.PI / nStacks;
    const dTheta = (2 * Math.PI) / nSectors;

    const vertices: REGL.Vec3[] = [];

    for (let i = 0; i < nStacks; i++) {
      const phi = i * dPhi;

      for (let j = 0; j < nSectors; j++) {
        const theta = j * dTheta;

        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        vertices.push([x, y, z]);
      }
    }

    return vertices;
  }
}
