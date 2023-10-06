export function clamp(x: number, lo: number, hi: number) {
  return Math.min(Math.max(x, lo), hi);
}
