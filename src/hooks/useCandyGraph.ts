import CandyGraph, { Font, createDefaultFont } from "candygraph";
import { useEffect, useMemo, useState } from "react";

type UseCandyGraphArgs = {
  width: number;
  height: number;
};

export const useCandyGraph = ({ width, height }: UseCandyGraphArgs) => {
  const cg = useMemo(() => {
    const cg = new CandyGraph();
    cg.canvas.width = width;
    cg.canvas.height = height;
    return cg;
  }, [width, height]);

  const [font, setFont] = useState<Font | undefined>(undefined);
  useEffect(() => {
    if (font) return;
    createDefaultFont(cg).then((f) => setFont(f));
  }, [cg, font]);

  return { cg, font };
};
