import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { Layout } from "react-grid-layout";
import { CtlManifestType } from "./useFlowChartState";

const initialManifests: CtlManifestType[] = [
  {
    type: "input",
    name: "Slider",
    id: "INPUT_PLACEHOLDER",
    hidden: false,
    minHeight: 1,
    minWidth: 2,
    layout: {
      x: 0,
      y: 0,
      h: 2,
      w: 2,
      minH: 1,
      minW: 2,
      i: "INPUT_PLACEHOLDER",
    },
  },
];

export const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const gridLayoutAtom = atomWithImmer<Layout[]>(
  initialManifests.map((ctrl) => ({
    ...ctrl.layout,
  })),
);
export const maxGridLayoutHeightAtom = atom((get) =>
  Math.max(...get<Layout[]>(gridLayoutAtom).map((el) => el.y)),
);

export const useControlsState = () => {
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [maxGridLayoutHeight] = useAtom(maxGridLayoutHeightAtom);

  return {
    ctrlsManifest,
    setCtrlsManifest,
    gridLayout,
    setGridLayout,
    maxGridLayoutHeight,
  };
};
