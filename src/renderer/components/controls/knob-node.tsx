import { KnobConfig, WidgetProps } from "@/renderer/types/control";
import WidgetLabel from "@/renderer/components/common/widget-label";
import { useControl } from "@/renderer/hooks/useControl";
import { useRef } from "react";

const minAngle = 0;
const maxAngle = Math.PI;

const frac = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

const clamp = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const angleFromValue = (value: number, min: number, max: number) => {
  return clamp(maxAngle * frac(value, min, max), minAngle, maxAngle);
};

const nearestMultiple = (x: number, y: number) => {
  return Math.round(x / y) * y;
};

const valueFromAngle = (
  angle: number,
  min: number,
  max: number,
  step: number,
) => {
  const angleRange = maxAngle - minAngle;
  const valRange = max - min;
  return clamp(
    nearestMultiple(min + valRange * (angle / angleRange), step),
    min,
    max,
  );
};

class Vector2 {
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

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
};

const Knob = ({ value, min, max, step, onValueChange }: Props) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const angle = useRef(angleFromValue(value, min, max));
  const radius = 80;
  const rotationSpeed = 16;

  const handleMouseDown = (event) => {
    event.preventDefault();
    angle.current = angleFromValue(value, min, max);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    if (knobRef.current === null) {
      return;
    }
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pointPos = new Vector2(
      Math.cos(angle.current) * radius,
      Math.sin(angle.current) * radius,
    );
    const normal = new Vector2(pointPos.y, -pointPos.x).normalized();

    // Project the mouse position onto the normal
    const mouseVec = new Vector2(
      event.clientX - centerX,
      centerY - event.clientY,
    ).normalized();
    const proj = normal.scaled(mouseVec.dot(normal) * rotationSpeed);
    const newPos = pointPos.add(proj).normalized().scaled(radius);

    let newAngle = Math.atan2(newPos.y, newPos.x);

    const up = new Vector2(0, 1);
    const dp = normal.dot(up);
    if (newAngle < minAngle && dp > 0) {
      newAngle = maxAngle;
    }
    if (newAngle > maxAngle && dp < 0) {
      newAngle = minAngle;
    }

    const newValue = valueFromAngle(newAngle, min, max, step);
    angle.current = newAngle;

    onValueChange(newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="nodrag mb-4 flex flex-col items-center">
      <div
        className="relative cursor-pointer rounded-full border-2 bg-background"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        ref={knobRef}
        style={{
          transform: `rotate(-${angleFromValue(value, min, max)}rad)`,
          width: radius,
          height: radius,
        }}
      >
        <div className="absolute right-0 top-1/2 h-2 w-4 -translate-y-1/2 transform rounded-sm bg-accent1" />
      </div>
      <span className="text-sm text-gray-600">{value}</span>
    </div>
  );
};

export const KnobNode = ({ id, data }: WidgetProps<KnobConfig>) => {
  const control = useControl(data);
  if (!control) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const { name, value, onValueChange } = control;

  return (
    <div className="flex flex-col items-center gap-2">
      <WidgetLabel
        label={data.label}
        placeholder={`${name} (${data.blockParameter})`}
        widgetId={id}
      />
      <Knob
        value={value as number}
        onValueChange={onValueChange}
        min={data.config.min}
        max={data.config.max}
        step={data.config.step}
      />
    </div>
  );
};
