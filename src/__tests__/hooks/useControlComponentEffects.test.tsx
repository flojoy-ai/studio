import React from "react";
import { expect, jest, it, beforeEach } from "@jest/globals";
import { act, renderHook, Renderer } from "@testing-library/react-hooks";

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

describe("useControlsTabEffects", () => {
  it("checks if the hook renders properly", () => {
    const spy = jest.spyOn(React, "useEffect");
    rerender();
    expect(spy).toHaveBeenCalledTimes(5);
  });
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
