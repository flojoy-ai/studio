import { useControlsState } from "@src/hooks/useControlsState";
import { CtlManifestType } from "@src/hooks/useFlowChartState";
import { renderHook } from "@testing-library/react";

const { result } = renderHook(() => useControlsState());
const hookResult = result.current;

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
const initialLayout = initialManifests.map((ctrl) => ({
  ...ctrl.layout,
}));

describe("useControlsState", () => {
  describe("checking default values of states", () => {
    it.each([
      ["ctrlsManifest", hookResult.ctrlsManifest, initialManifests],
      ["gridLayout", hookResult.gridLayout, initialLayout],
      ["maxGridLayoutHeight", hookResult.maxGridLayoutHeight, 1],
    ])("%p", (_, currentResult, expectedResult) => {
      expect(currentResult).toEqual(expectedResult);
    });
  });
});
