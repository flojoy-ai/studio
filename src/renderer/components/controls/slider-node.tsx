import { Input } from "@/renderer/components/ui/input";

export const SliderNode = () => {
  return (
    <div>
      <Input type="range" min="1" max="100" />
    </div>
  );
};
