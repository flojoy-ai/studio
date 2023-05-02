import { renderHook } from "@testing-library/react";

import useControlsTabEffects from "../../hooks/useControlComponentEffects";
import { CtlManifestType } from "../../hooks/useFlowChartState";
import { NOISY_SINE } from "../../data/RECIPES";

const flowChartObject: any = {
  nodes: NOISY_SINE.nodes,
  edges: NOISY_SINE.edges,
  viewport: {
    x: 1,
    y: 2,
    zoom: 10,
  },
};

const ctrlObj: CtlManifestType = {
  type: "test",
  name: "test",
  id: "test-123",
  param: "test",
  val: "test",
  hidden: true,
  segmentColor: "red",
  controlGroup: "yellow",
  label: "test",
  minHeight: 10,
  minWidth: 10,
  layout: {
    w: 2,
    h: 2,
    x: 0,
    y: 0,
    i: "INPUT_PLACEHOLDER",
    minW: 2,
    minH: 1,
    moved: false,
    static: false,
  },
};

const selectOptions = [
  {
    label: "test",
    value: "test",
    type: "test",
    mode: "lines",
  },
];

const selectedOptions = selectOptions;
const defaultValue = 0;
const ctrls = {};
const results = {
  io: [],
};

const hookParams: any = {
  flowChartObject: flowChartObject,
  setSelectedOption: jest.fn(),
  ctrlObj: ctrlObj,
  selectOptions: selectOptions,
  selectedOption: selectedOptions,
  setCurrentInputValue: jest.fn(),
  defaultValue: defaultValue,
  ctrls: ctrls,
  setSelectOptions: jest.fn(),
  setKnobValue: jest.fn(),
  setTextInput: jest.fn(),
  setNumberInput: jest.fn(),
  setSliderInput: jest.fn(),
  setNd: jest.fn(),
  results: results,
};

const { result, rerender } = renderHook(() =>
  useControlsTabEffects(hookParams)
);

jest.mock("@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST", () => {
  return {
    FUNCTION_PARAMETERS: {},
  };
});

describe("useControlsTabEffects", () => {
  it("given ctrlsobj type is output, maps ctrls object param with selected item value", () => {
    const testCtrlObj = { ...ctrlObj, type: "output" };
    const testHookParams = { ...hookParams, ctrlObj: testCtrlObj };
    renderHook(() => useControlsTabEffects(testHookParams));
    expect(testHookParams.setSelectedOption).toHaveBeenCalled();
  });
  it("given an undefined ctrls option, sets currentInputvalue as default", () => {
    const testHookParams = { ...hookParams, ctrls: undefined };
    renderHook(() => useControlsTabEffects(testHookParams));
    expect(testHookParams.setCurrentInputValue).toHaveBeenCalledWith(
      testHookParams.defaultValue
    );
  });
});
