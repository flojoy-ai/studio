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
// describe("openEditModal State Test", () => {
//   it("checks if the openEditModal  hook renders 'false'", () => {
//     const { result } = renderHook(useControlsTabState);
//     expect(result.current.openEditModal).toBe(false);
//   });

//   it("checks if the openEditModal hook fires", () => {
//     const { result } = renderHook(useControlsTabState);
//     act(() => result.current.setOpenEditModal(true));
//     expect(result.current.openEditModal).toBe(true);
//   });
// });

// OpenEditModal State Test
describe("openEditModal State Test", () => {
  // Initial Value Test (It Can't be checked inside the .each() function)
  it("checks if the openEditModal  hook renders 'false'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.openEditModal).toBe(false);
  });

  test.each([
    [false, false],
    [true, true],
  ])(
    "checks if the openEditModal hook renders/fires with '%p'",
    (a, expected) => {
      const { result } = renderHook(useControlsTabState);
      act(() => result.current.setOpenEditModal(a));
      expect(result.current.openEditModal).toBe(expected);
    }
  );
});

// CurrentInput State Test
describe("CurrentInput State Test", () => {
  // Initial Value Test (It Can't be checked inside the .each() function)
  it("checks if the openEditModal  hook renders 'false'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.currentInput).toBe(undefined);
  });

  test.each([[currentInputTestParams, currentInputTestParams]])(
    "checks if the openEditModal hook renders/fires with '%p'",
    (a, expected) => {
      const { result } = renderHook(useControlsTabState);
      act(() => result.current.setCurrentInput(a));
      expect(result.current.currentInput).toBe(expected);
    }
  );
});

// debouncedTimerId State Test
describe("debouncedTimerId State Test", () => {
  // Initial Value Test (It Can't be checked inside the .each() function)
  it("checks if the debouncedTimerId hook renders with 'undefined'", () => {
    const { result } = renderHook(useControlsTabState);
    expect(result.current.debouncedTimerId).toBe(undefined);
  });

  test.each([
    [setTimeout(() => "timer fired!", 1000), 2],
    [setTimeout(() => "timer fired!", 3000), 3],
  ])(
    "checks if the openEditModal hook renders/fires with '%p'",
    (a, expected) => {
      const { result } = renderHook(useControlsTabState);
      act(() => result.current.setDebouncedTimerId(a));
      // console.log(result.current.debouncedTimerId);
      expect(result.current.debouncedTimerId).toBe(expected);
    }
  );
});
