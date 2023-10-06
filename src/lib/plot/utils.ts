import { vec3 } from "gl-matrix";

export function clamp(x: number, lo: number, hi: number) {
  return Math.min(Math.max(x, lo), hi);
}

export function clampVector(v: vec3, maxLength: number) {
  const l = vec3.length(v);
  vec3.normalize(v, v);
  return vec3.scale(v, v, Math.min(l, maxLength));
}
