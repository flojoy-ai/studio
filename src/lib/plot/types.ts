import { Vec2 } from "regl";

export interface Drawable {
  draw: () => void;
}

export type Axis = {
  domain: Vec2;
  step: number;
};
