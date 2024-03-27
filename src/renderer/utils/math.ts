export const frac = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

export const nearestMultiple = (x: number, y: number) => {
  return Math.round(x / y) * y;
};

export const countDecimalPlaces = (num: number) => {
  const numString = num.toString();
  const decimalIndex = numString.indexOf(".");
  if (decimalIndex === -1) {
    return 0;
  }

  return numString.length - decimalIndex - 1;
};

export class Vector2 {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  scaled(s: number) {
    return new Vector2(s * this.x, s * this.y);
  }

  dot(other: Vector2) {
    return this.x * other.x + this.y * other.y;
  }

  normalized() {
    return this.scaled(1 / this.magnitude());
  }
}
