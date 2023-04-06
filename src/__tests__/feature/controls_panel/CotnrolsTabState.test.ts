import { CtlManifestType } from "@src/hooks/useFlowChartState";
import { act, renderHook } from "@testing-library/react-hooks";

import { useControlsTabState } from "../../../feature/controls_panel/ControlsTabState";

const currentInputTestParams: CtlManifestType & { index: number } = {
  type: "input",
  name: "Slider",
  id: "INPUT_PLACEHOLDER",
  hidden: false,
  minHeight: 1,
  minWidth: 2,
  layout: {
    h: 12,
    w: 12,
    i: "test-id",
    x: 10,
    y: 10,
  },
  index: 0,
};

describe("openEditModal State Test", () => {
  it("checks if the openEditModal  hook renders 'false'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.openEditModal).toBe(false);
  });

  test.each([
    [false, false],
    [true, true],
  ])(
    "checks if the openEditModal hook renders/fires with '%p'",
    (setOpenEditModalValue, updatedSetOpenEditModalValue) => {
      const { result } = renderHook(useControlsTabState);
      act(() => result.current.setOpenEditModal(setOpenEditModalValue));
      expect(result.current.openEditModal).toBe(updatedSetOpenEditModalValue);
    }
  );
});

describe("CurrentInput State Test", () => {
  it("checks if the openEditModal  hook renders 'false'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.currentInput).toBe(undefined);
  });

  test.each([[currentInputTestParams, currentInputTestParams]])(
    "checks if the openEditModal hook renders/fires with '%p'",
    (setCurrentInputValue, updatedSetCurrentInputValue) => {
      const { result } = renderHook(useControlsTabState);
      act(() => result.current.setCurrentInput(setCurrentInputValue));
      expect(result.current.currentInput).toBe(updatedSetCurrentInputValue);
    }
  );
});

describe("debouncedTimerId State Test", () => {
  it("checks if the debouncedTimerId hook renders with 'undefined'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.debouncedTimerId).toBe(undefined);
  });

  test.each([
    [setTimeout(() => "timer fired!", 1000), 2],
    [setTimeout(() => "timer fired!", 3000), 3],
  ])(
    "checks if the openEditModal hook renders/fires with '%p'",
    (debouncedTimerIdValue, updatedDebouncedTimerIdValue) => {
      const { result } = renderHook(useControlsTabState);
      act(() => result.current.setDebouncedTimerId(debouncedTimerIdValue));
      expect(result.current.debouncedTimerId).toBe(
        updatedDebouncedTimerIdValue
      );
    }
  );
});
