import * as React from "react";
import { renderHook } from "@testing-library/react";
import { useFlowChartTabEffects } from "@src/feature/flow_chart_panel/FlowChartTabEffects";

const params: any = {
  results: {
    io: [],
  },
  clickedElement: {
    data: {
      label: "test",
      type: "test",
      func: "test",
    },
  },
  setNodeLabel: jest.fn(),
  setNodeType: jest.fn(),
  setPythonString: jest.fn(),
  setNd: jest.fn(),
  defaultPythonFnLabel: "",
  defaultPythonFnType: "",
  nodeLabel: "",
  nodeType: "",
};

jest.mock("@src/hooks/useFlowChartState", () => {
  return {
    useFlowChartState: () => {
      return {
        rfInstance: {},
      };
    },
  };
});

jest.mock("@src/services/FlowChartServices", () => {
  return {
    saveFlowChartToLocalStorage: () => jest.fn(),
  };
});

describe("FlowChartTabState", () => {
  it("should call useEffect 3 times", () => {
    const { rerender } = renderHook(() => useFlowChartTabEffects(params));

    const spy = jest.spyOn(React, "useEffect");
    rerender();
    expect(spy).toHaveBeenCalledTimes(3);
  });
  it("checks if the function is called", () => {
    const { rerender } = renderHook(() => useFlowChartTabEffects(params));

    rerender();
    expect(params.setNd).toHaveBeenCalled();
  });
  it("checks if the hook returns anything", () => {
    const { result, rerender } = renderHook(() =>
      useFlowChartTabEffects(params)
    );

    rerender();
    expect(result.current).toBe(undefined);
  });
});
