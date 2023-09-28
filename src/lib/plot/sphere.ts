import REGL from "regl";
import { mat4 } from "gl-matrix";

type Uniforms = {
  translate: mat4;
  scale: mat4;
  rotate: mat4;
};

type Attributes = {
  position: REGL.Vec3[];
};

type SphereOptions = {
  radius: number;
  center: REGL.Vec3;
  nStacks?: number;
  nSectors?: number;
};

export function Sphere(options: SphereOptions) {
  const { radius, center, nStacks = 180, nSectors = 360 } = options;
  const vertices = createVertices(nStacks, nSectors);

  return (regl: REGL.Regl) =>
    regl<Uniforms, Attributes>({
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

        uniform mat4 rotate, scale, translate, view, projection;

        varying vec4 v_color;

        void main() {
          vec4 pos = vec4(position, 1);
          gl_PointSize = 2.0;
          gl_Position = projection * view * translate * scale * rotate * pos;
          v_color = pos; 
        }
      `,
      attributes: {
        position: vertices,
      },

      uniforms: {
        translate: mat4.translate(new Float32Array(16), mat4.create(), center),
        scale: mat4.scale(new Float32Array(16), mat4.create(), [
          radius,
          radius,
          radius,
        ]),
        rotate: ({ tick }) => {
          const t = 0.01 * tick;
          return mat4.rotate(new Float32Array(16), mat4.create(), t, [0, 1, 0]);
        },
      },

      count: vertices.length,
      primitive: "points",
    });
}

function createVertices(nStacks: number, nSectors: number) {
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
