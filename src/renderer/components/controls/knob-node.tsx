import { KnobConfig, WidgetProps } from "@/renderer/types/control";
import WidgetLabel from "@/renderer/components/common/widget-label";
import { useControl } from "@/renderer/hooks/useControl";
import { useRef } from "react";

type Props = {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
};

type Vector2 = {
  x: number;
  y: number;
};

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
  return clamp(Math.PI * frac(value, min, max), 0, Math.PI);
};

const valueFromAngle = (angle: number, min: number, max: number) => {
  return clamp(min + (max - min) * (angle / Math.PI), min, max);
};

const multiply = (v: Vector2, s: number) => {
  return { x: s * v.x, y: s * v.y };
};

const divide = (v: Vector2, s: number) => {
  return multiply(v, 1 / s);
};

const dot = (v1: Vector2, v2: Vector2) => {
  return v1.x * v2.x + v1.y * v2.y;
};

const normalize = (v: Vector2) => {
  return divide(v, magnitude(v));
};

const magnitude = (v: Vector2) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

const Knob = ({ value, min, max, onValueChange }: Props) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const angle = useRef(angleFromValue(value, min, max));
  const radius = 80;
  const rotationSpeed = 4;

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

    const pointPos = {
      x: Math.cos(angle.current) * radius,
      y: Math.sin(angle.current) * radius,
    };
    const normal = normalize({
      x: pointPos.y,
      y: -pointPos.x,
    });
    // Project the mouse position onto the normal
    const mouseVec = normalize({
      x: event.clientX - centerX,
      y: centerY - event.clientY,
    });

    const proj = multiply(normal, dot(mouseVec, normal) * rotationSpeed);
    const newPos = multiply(
      normalize({
        x: pointPos.x + proj.x,
        y: pointPos.y + proj.y,
      }),
      radius,
    );
    const newAngle = Math.atan2(newPos.y, newPos.x);

    const newValue = valueFromAngle(newAngle, min, max);
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
        className="relative cursor-pointer rounded-full bg-gray-200"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        ref={knobRef}
        style={{
          transform: `rotate(-${angleFromValue(value, min, max)}rad)`,
          width: radius,
          height: radius,
        }}
      >
        <div className="absolute right-0 top-1/2 h-1/5 w-2/5 -translate-y-1/2 transform bg-gray-600" />
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
      />
    </div>
  );
};
