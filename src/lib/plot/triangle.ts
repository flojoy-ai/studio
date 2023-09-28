import REGL from "regl";

type Uniforms = {
  color: REGL.Vec4;
};

type Attributes = {
  position: REGL.Vec3[];
};

export function Triangle(points: [REGL.Vec3, REGL.Vec3, REGL.Vec3]) {
  return (regl: REGL.Regl) =>
    regl<Uniforms, Attributes>({
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
        position: points,
      },

      uniforms: {
        color: [1, 0, 0, 1],
      },

      count: 3,
    });
}
