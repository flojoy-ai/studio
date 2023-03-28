import { renderHook } from "@testing-library/react-hooks";
import { useControlsTabEffects } from "../../../feature/controls_panel/ControlsTabEffects";
import { useFlowChartState } from "../../../hooks/useFlowChartState";

jest.mock("@src/hooks/useFlowChartState");

describe("useControlsTabEffects tests", () => {
  let setCtrlsManifest = jest.fn();
  let rfInstance = {
    nodes: [{ id: 1, type: "start" }],
  };

  it("should not call setCtrlsManifest when rfInstance.nodes is not empty", () => {
    rfInstance.nodes = [{ id: 1, type: "start" }];
    renderHook(() => useControlsTabEffects);
    expect(setCtrlsManifest).not.toHaveBeenCalledWith([]);
  });
});
