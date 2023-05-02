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

const { result, rerender } = renderHook(() => useFlowChartTabEffects(params));

describe("FlowChartTabState", () => {
  it("should call useEffect 4 times", () => {
    const spy = jest.spyOn(React, "useEffect");
    rerender();
    expect(spy).toHaveBeenCalledTimes(4);
  });
  it("checks if the function is called", () => {
    rerender();
    expect(params.setNd).toHaveBeenCalled();
  });
  it("checks if the hook returns anything", () => {
    rerender();
    expect(result.current).toBe(undefined);
  });
});
