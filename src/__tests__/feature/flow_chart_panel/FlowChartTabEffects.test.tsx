import * as React from "react";
import { renderHook } from "@testing-library/react";
import { useFlowChartTabEffects } from "@src/feature/flow_chart_panel/FlowChartTabEffects";
import { FlowChartTabStateReturnType } from "@src/feature/flow_chart_panel/FlowChartTabState";
import { ResultsType } from "@src/feature/common/types/ResultsType";
import { Node } from "reactflow";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";

const params: FlowChartTabStateReturnType & {
  results: ResultsType | null;
  selectedNode: Node<ElementsData> | null;
} = {
  results: {
    io: [],
  },
  selectedNode: null,
  setNodeLabel: jest.fn(),
  setNodeType: jest.fn(),
  setPythonString: jest.fn(),
  setNd: jest.fn(),
  defaultPythonFnLabel: "",
  defaultPythonFnType: "",
  nodeLabel: "",
  nodeType: "",
  closeModal: jest.fn(),
  modalIsOpen: false,
  nd: null,
  nodeFilePath: "",
  pythonString: "",
  setIsModalOpen: jest.fn(),
  setNodeFilePath: jest.fn(),
  windowWidth: 1000,
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
    expect(spy).toHaveBeenCalledTimes(1);
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
