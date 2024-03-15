import { KnobConfig, WidgetProps } from "@/renderer/types/control";
import { WidgetLabel } from "@/renderer/components/common/control-label";
import { useControl } from "@/renderer/hooks/useControl";
import { useMemo, useRef } from "react";
import {
  Vector2,
  clamp,
  countDecimalPlaces,
  frac,
  nearestMultiple,
} from "@/renderer/utils/math";

const minAngle = -Math.PI / 6;
const maxAngle = (7 * Math.PI) / 6;

const angleFromValue = (value: number, min: number, max: number) => {
  const angleRange = maxAngle - minAngle;
  const f = frac(value, min, max);
  return clamp(minAngle + angleRange * f, minAngle, maxAngle);
};

const valueFromAngle = (
  angle: number,
  min: number,
  max: number,
  step: number,
) => {
  const angleRange = maxAngle - minAngle;
  const valRange = max - min;
  const computedVal = min + valRange * ((angle - minAngle) / angleRange);
  return clamp(nearestMultiple(computedVal, step), min, max);
};

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  radius: number;
  onValueChange: (value: number) => void;
};

const Knob = ({ value, min, max, step, radius, onValueChange }: Props) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const angle = useRef(angleFromValue(value, min, max));

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    angle.current = angleFromValue(value, min, max);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (knobRef.current === null) {
      return;
    }
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseVec = new Vector2(
      event.clientX - centerX,
      centerY - event.clientY,
    ).normalized();
    const newPos = mouseVec.scaled(radius);
    let newAngle = Math.atan2(newPos.y, newPos.x);
    if (newAngle < -Math.PI / 2) {
      newAngle += 2 * Math.PI;
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
    <div className="nodrag flex flex-col items-center">
      <div
        className="relative cursor-pointer rounded-full border-2 bg-background"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        ref={knobRef}
        style={{
          transform: `rotate(${-angleFromValue(value, min, max)}rad)`,
          width: radius,
          height: radius,
        }}
      >
        <div className="absolute right-0 top-1/2 h-2 w-4 -translate-y-1/2 transform rounded-sm bg-accent1" />
      </div>
    </div>
  );
};

export const KnobNode = ({ id, data }: WidgetProps<KnobConfig>) => {
  const control = useControl(data);
  const numDecimals = useMemo(
    () => countDecimalPlaces(data.config.step),
    [data.config.step],
  );

  if (!control) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const { name, value, onValueChange } = control;

  return (
    <div className="flex flex-col items-center gap-2">
      <WidgetLabel
        label={data.label}
        placeholder={`${name} (${data.blockParameter})`}
        id={id}
      />
      <Knob
        value={value as number}
        onValueChange={onValueChange}
        min={data.config.min}
        max={data.config.max}
        step={data.config.step}
        radius={80}
      />
      <div className="text-xl font-bold">
        {(value as number).toFixed(numDecimals)}
      </div>
    </div>
  );
};
