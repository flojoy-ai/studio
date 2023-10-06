import { mat4, vec3 } from "gl-matrix";
import { Vec3, DefaultContext, DrawCommand } from "regl";
import { clamp } from "./utils";
import { Plot } from ".";

export type CameraOptions = Partial<{
  center: Vec3;
  theta: number;
  phi: number;
  distance: number;
  up: Vec3;
  minDistance: number;
  maxDistance: number;
}>;

type CameraState = {
  view: mat4;
  projection: mat4;
  center: vec3;
  theta: number;
  phi: number;
  distance: number;
  eye: vec3;
  up: vec3;
  panLeft: vec3;
  panUp: vec3;
};

export class Camera {
  private readonly plot: Plot;
  private readonly right = new Float32Array([1, 0, 0]);
  private readonly front = new Float32Array([0, 0, 1]);
  private readonly minDistance: number;
  private readonly maxDistance: number;

  private state: CameraState;

  private dtheta = 0;
  private dphi = 0;
  private ddistance = 0;

  private injectContext: DrawCommand;

  constructor(plot: Plot, options?: CameraOptions) {
    this.state = {
      view: mat4.identity(new Float32Array(16)),
      projection: mat4.identity(new Float32Array(16)),
      center: options?.center
        ? new Float32Array(options?.center)
        : new Float32Array(3),
      theta: options?.theta ?? 0,
      phi: options?.phi ?? 0,
      distance: Math.log(options?.distance ?? 10.0),
      eye: new Float32Array(3),
      up: new Float32Array(options?.up ?? [0, 1, 0]),
      panLeft: new Float32Array(3),
      panUp: new Float32Array(3),
    };

    this.minDistance = Math.log(options?.minDistance ?? 0.1);
    this.maxDistance = Math.log(options?.maxDistance ?? 1000);

    this.plot = plot;

    this.injectContext = this.plot.regl({
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

    const onMouseDown = (ev: MouseEvent) => {
      console.log("bruh");
      ev.preventDefault();
      ev.stopPropagation();
      const vecs = this.getPanVectors();
      console.log("pan vectors");
      console.log(vecs.left);
      console.log(vecs.forward);
      this.state.panLeft = vecs.left;
      this.state.panUp = vecs.forward;
    };

    const onMouseMove = (ev: MouseEvent) => {
      const leftButtonPressed = ev.buttons & 1;
      ev.preventDefault();
      ev.stopPropagation();
      const dx = ev.movementX / window.innerWidth;
      const dy = ev.movementY / window.innerHeight;
      if (leftButtonPressed && ev.ctrlKey) {
        this.rotate(dx, dy);
      } else if (leftButtonPressed) {
        this.pan(dx, dy);
      }
    };

    const onMouseWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      this.ddistance += ev.deltaY / window.innerHeight / 5;
    };

    plot.canvas.addEventListener("mousedown", onMouseDown);
    plot.canvas.addEventListener("mousemove", onMouseMove);
    plot.canvas.addEventListener("wheel", onMouseWheel);
  }

  public drawInContext(block: (context: DefaultContext) => void) {
    this.updateCamera();
    this.injectContext(block);
  }

  private updateCamera() {
    const center = this.state.center;
    const eye = this.state.eye;
    const up = this.state.up;

    this.state.theta += this.dtheta;
    this.state.phi = clamp(
      this.state.phi + this.dphi,
      -Math.PI / 2.1,
      Math.PI / 2.1,
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

  private pan(dx: number, dy: number) {
    vec3.scaleAndAdd(
      this.state.center,
      this.state.center,
      this.state.panUp,
      dy * 10,
    );
    vec3.scaleAndAdd(
      this.state.center,
      this.state.center,
      this.state.panLeft,
      -dx * 10,
    );
  }

  private rotate(dx: number, dy: number) {
    const w = Math.max(this.state.distance, 0.5);

    this.dtheta += w * dx;
    this.dphi += w * dy;
  }

  private getPanVectors() {
    const u = vec3.create();
    const v = vec3.create();
    vec3.normalize(u, vec3.sub(u, this.state.eye, this.state.center));
    vec3.scale(v, this.state.up, vec3.dot(u, this.state.up));
    const forward = vec3.normalize(
      vec3.create(),
      vec3.sub(vec3.create(), v, u),
    );
    const left = vec3.normalize(
      vec3.create(),
      vec3.cross(vec3.create(), forward, u),
    );

    return {
      forward,
      left,
    };
  }
}
