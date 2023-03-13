import { expect, jest, it, beforeEach } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";

import { useControlsTabState } from "../../../feature/controls_panel/ControlsTabState";

const currentInputTestParams = {
  type: "input",
  name: "Slider",
  id: "INPUT_PLACEHOLDER",
  hidden: false,
  minHeight: 1,
  minWidth: 2,
  index: 0,
};

// OpenEditModal State Test
describe("openEditModal State Test", () => {
  it("checks if the openEditModal  hook renders 'false'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.openEditModal).toBe(false);
  });

  it("checks if the openEditModal hook fires", () => {
    const { result } = renderHook(useControlsTabState);
    act(() => result.current.setOpenEditModal(true));
    expect(result.current.openEditModal).toBe(true);
  });
});

// CurrentInput State Test
describe("currentInput State Test", () => {
  it("checks if the currentInput hook renders 'undefined'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.currentInput).toBe(undefined);
  });

  it("checks if the openEditModal hook fires", () => {
    const { result } = renderHook(useControlsTabState);
    act(() => result.current.setCurrentInput(currentInputTestParams));
    expect(result.current.currentInput).toBe(currentInputTestParams);
  });
});

// debouncedTimerId State Test
describe("debouncedTimerId State Test", () => {
  it("checks if the debouncedTimerId hook renders with 'undefined'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.debouncedTimerId).toBe(undefined);
  });

  it("checks if the debouncedTimerId hook fires", () => {
    const { result } = renderHook(useControlsTabState);
    act(() =>
      result.current.setDebouncedTimerId(setTimeout(() => "timer fired!", 1000))
    );
    // console.log(result.current.debouncedTimerId);
    expect(result.current.debouncedTimerId).toBe(31);
  });
});
