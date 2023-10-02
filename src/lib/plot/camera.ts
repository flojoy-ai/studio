import mouseChange from "mouse-change";
import mouseWheel from "mouse-wheel";
import { mat4 } from "gl-matrix";
import { Vec3, Regl, DefaultContext } from "regl";
import { clamp } from "./utils";
import { Plot } from ".";

type Props = {
  center: Vec3;
  theta: number;
  phi: number;
  distance: number;
  up: Vec3;
  minDistance: number;
  maxDistance: number;
};

type Mods = {
  shift: boolean;
  alt: boolean;
  control: boolean;
  meta: boolean;
};

type CameraState = {
  view: mat4;
  projection: mat4;
  center: Float32Array;
  theta: number;
  phi: number;
  distance: number;
  eye: Float32Array;
  up: Float32Array;
};

export class Camera {
  private readonly plot: Plot;
  private state: CameraState;
  private readonly right = new Float32Array([1, 0, 0]);
  private readonly front = new Float32Array([0, 0, 1]);
  private readonly minDistance: number;
  private readonly maxDistance: number;

  private dtheta = 0;
  private dphi = 0;
  private ddistance = 0;

  private prevX = 0;
  private prevY = 0;

  constructor(plot: Plot, props: Partial<Props>) {
    this.state = {
      view: mat4.identity(new Float32Array(16)),
      projection: mat4.identity(new Float32Array(16)),
      center: props.center
        ? new Float32Array(props.center)
        : new Float32Array(3),
      theta: props.theta ?? 0,
      phi: props.phi ?? 0,
      distance: Math.log(props.distance ?? 10.0),
      eye: new Float32Array(3),
      up: new Float32Array(props.up ?? [0, 1, 0]),
    };

    this.minDistance = Math.log(props.minDistance ?? 0.1);
    this.maxDistance = Math.log(props.maxDistance ?? 1000);

    this.plot = plot;

    plot.canvas.addEventListener("mousemove", this.onMouseMove);
    plot.canvas.addEventListener("wheel", this.onMouseWheel);
  }

  public update() {}

  private onMouseMove(ev: MouseEvent) {
    const leftButtonPressed = ev.buttons & 1;
    if (leftButtonPressed && ev.ctrlKey) {
      const dx = ev.movementX / window.innerWidth;
      const dy = ev.movementY / window.innerHeight;
      const w = Math.max(this.state.distance, 0.5);

      this.dtheta += w * dx;
      this.dphi += w * dy;
    }
  }

  private onMouseWheel(ev: WheelEvent) {
    this.ddistance += ev.deltaY / window.innerHeight / 5;
  }

  private updateCamera() {
    const center = this.state.center;
    const eye = this.state.eye;
    const up = this.state.up;

    this.state.theta += this.dtheta;
    this.state.phi = clamp(
      this.state.phi + this.dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0,
    );
    this.state.distance = clamp(
      this.state.distance + this.ddistance,
      this.minDistance,
      this.maxDistance,
    );

    this.dtheta = 0;
    this.dphi = 0;
    this.ddistance = 0;

    const theta = this.state.theta;
    const phi = this.state.phi;
    const r = Math.exp(this.state.distance);

    const vf = r * Math.sin(theta) * Math.cos(phi);
    const vr = r * Math.cos(theta) * Math.cos(phi);
    const vu = r * Math.sin(phi);

    for (let i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * this.front[i] + vr * this.right[i] + vu * up[i];
    }

    mat4.lookAt(this.state.view, eye, center, up);
  }

  private injectContext() {
    this.plot.regl({
      context: Object.assign({}, this.state, {
        projection: ({ viewportWidth, viewportHeight }) => {
          return mat4.perspective(
            this.state.projection,
            Math.PI / 4.0,
            viewportWidth / viewportHeight,
            0.01,
            1000.0,
          );
        },
      }),
      uniforms: Object.keys(this.state).reduce((uniforms, name) => {
        uniforms[name] = this.plot.regl.context(name as keyof DefaultContext);
        return uniforms;
      }, {}),
    });
  }
}

export default function createCamera(regl: Regl, props: Partial<Props>) {
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

  mouseChange((buttons: number, x: number, y: number, mods: Mods) => {
    if (buttons & 1 && mods.control) {
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
      uniforms[name] = regl.context(name as keyof DefaultContext);
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
