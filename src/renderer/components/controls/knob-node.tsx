import { KnobConfig, WidgetProps } from "@/renderer/types/control";
import WidgetLabel from "@/renderer/components/common/widget-label";
import { useControl } from "@/renderer/hooks/useControl";
import { useState } from "react";

type Props = {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
};

const Knob = ({ value, min, max, onValueChange }: Props) => {
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = () => {
    setDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    if (!dragging) return;

    const knob = event.target;
    const knobRect = knob.getBoundingClientRect();
    const offsetY = knobRect.bottom - event.clientY;
    const percent = offsetY / knobRect.height;

    let newValue = Math.round((min + percent * (max - min)) * 100) / 100;
    newValue = Math.min(max, Math.max(min, newValue));

    onValueChange(newValue);
  };

  return (
    <div className="relative h-16 w-16">
      <div
        className="absolute left-0 top-0 h-full w-full cursor-pointer rounded-full border-2 border-gray-300"
        style={{
          transform: `rotate(${((value - min) / (max - min)) * 270 - 135}deg)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute -bottom-6 left-1/2 h-6 w-1 -translate-x-1/2 transform rounded-full bg-gray-800"></div>
        <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-gray-800"></div>
      </div>
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
