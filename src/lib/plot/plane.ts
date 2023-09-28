import REGL from "regl";

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

export function OrthogonalPlane(options: OrthogonalPlaneOptions) {
  const vertices = createVertices(options);

  return (regl: REGL.Regl) =>
    regl<Uniforms, Attributes>({
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
        position: vertices,
      },
      uniforms: {
        color: [0.5, 0.5, 0.5, 1],
      },
      count: vertices.length,
      primitive: "lines",
    });
}

function createVertices(options: OrthogonalPlaneOptions): REGL.Vec3[] {
  const vertices = createXZPlaneVertices(options);
  switch (options.orientation) {
    case "xz":
      return vertices;
    case "xy":
      return vertices.map((v) => [v[0], v[2], v[1]]);
    case "yz":
      return vertices.map((v) => [v[1], v[0], v[2]]);
  }
}

function createXZPlaneVertices({
  gridSize: size,
}: OrthogonalPlaneOptions): REGL.Vec3[] {
  const vertices: REGL.Vec3[] = [];

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
