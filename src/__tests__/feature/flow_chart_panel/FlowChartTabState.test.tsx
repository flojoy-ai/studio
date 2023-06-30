import { renderHook } from "@testing-library/react";
import { useFlowChartTabState } from "@src/feature/flow_chart_panel/FlowChartTabState";

const { result } = renderHook(() => useFlowChartTabState());

describe("FlowChartTabState", () => {
  it.each([
    [result.current.modalIsOpen, false],
    [result.current.nd, null],
    [result.current.nodeLabel, "PYTHON FUNCTION"],
    [result.current.nodeType, "PYTHON FUNCTION TYPE"],
    [result.current.pythonString, "..."],
    [result.current.defaultPythonFnLabel, "PYTHON FUNCTION"],
    [result.current.defaultPythonFnType, "PYTHON FUNCTION TYPE"],
  ])("checks %p to %p", (checkValue, expectValue) => {
    expect(checkValue).toEqual(expectValue);
  });
});
