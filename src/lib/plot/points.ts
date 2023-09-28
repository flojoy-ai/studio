import REGL from "regl";

type Uniforms = {
  size: number;
};

type Attributes = {
  position: REGL.Vec3[];
};

type PointsOptions = {
  pointSize: number;
};

export function Points(pts: REGL.Vec3[], options: PointsOptions) {
  return (regl: REGL.Regl) =>
    regl<Uniforms, Attributes>({
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
        position: pts,
      },

      uniforms: {
        size: options.pointSize,
      },

      count: pts.length,
      primitive: "points",
    });
}
