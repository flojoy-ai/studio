import mouseChange from "mouse-change";
import mouseWheel from "mouse-wheel";
import { mat4 } from "gl-matrix";
import REGL from "regl";

type Props = {
  center: REGL.Vec3;
  theta: number;
  phi: number;
  distance: number;
  up: REGL.Vec3;
  minDistance: number;
  maxDistance: number;
};

export default function createCamera(regl: REGL.Regl, props: Partial<Props>) {
  const cameraState = {
    view: mat4.identity(new Float32Array(16)),
    projection: mat4.identity(new Float32Array(16)),
    center: new Float32Array(props.center ?? 3),
    theta: props.theta ?? 0,
    phi: props.phi ?? 0,
    distance: Math.log(props.distance ?? 10.0),
    eye: new Float32Array(3),
    up: new Float32Array(props.up ?? [0, 1, 0]),
  };

  const right = new Float32Array([1, 0, 0]);
  const front = new Float32Array([0, 0, 1]);

  const minDistance = Math.log(props.minDistance ?? 0.1);
  const maxDistance = Math.log(props.maxDistance ?? 1000);

  let dtheta = 0;
  let dphi = 0;
  let ddistance = 0;

  let prevX = 0;
  let prevY = 0;

  mouseChange(function (buttons: number, x: number, y: number) {
    if (buttons & 1) {
      const dx = (x - prevX) / window.innerWidth;
      const dy = (y - prevY) / window.innerHeight;
      const w = Math.max(cameraState.distance, 0.5);

      dtheta += w * dx;
      dphi += w * dy;
    }
    prevX = x;
    prevY = y;
  });

  mouseWheel((dx: number, dy: number) => {
    ddistance += dy / window.innerHeight / 5;
  });

  function clamp(x: number, lo: number, hi: number) {
    return Math.min(Math.max(x, lo), hi);
  }

  function updateCamera() {
    const center = cameraState.center;
    const eye = cameraState.eye;
    const up = cameraState.up;

    cameraState.theta += dtheta;
    cameraState.phi = clamp(
      cameraState.phi + dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0,
    );
    cameraState.distance = clamp(
      cameraState.distance + ddistance,
      minDistance,
      maxDistance,
    );

    dtheta = 0;
    dphi = 0;
    ddistance = 0;

    const theta = cameraState.theta;
    const phi = cameraState.phi;
    const r = Math.exp(cameraState.distance);

    const vf = r * Math.sin(theta) * Math.cos(phi);
    const vr = r * Math.cos(theta) * Math.cos(phi);
    const vu = r * Math.sin(phi);

    for (let i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i];
    }

    mat4.lookAt(cameraState.view, eye, center, up);
  }

  const injectContext = regl({
    context: Object.assign({}, cameraState, {
      projection: function ({ viewportWidth, viewportHeight }) {
        return mat4.perspective(
          cameraState.projection,
          Math.PI / 4.0,
          viewportWidth / viewportHeight,
          0.01,
          1000.0,
        );
      },
    }),
    uniforms: Object.keys(cameraState).reduce((uniforms, name) => {
      uniforms[name] = regl.context(name as keyof REGL.DefaultContext);
      return uniforms;
    }, {}),
  });

  function setupCamera(block) {
    updateCamera();
    injectContext(block);
  }

  Object.keys(cameraState).forEach((name) => {
    setupCamera[name] = cameraState[name];
  });

  return setupCamera;
}
