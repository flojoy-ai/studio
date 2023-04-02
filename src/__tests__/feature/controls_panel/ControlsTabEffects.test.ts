import { renderHook } from "@testing-library/react-hooks";
import { useControlsTabEffects } from "@src/feature/controls_panel/ControlsTabEffects";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

jest.mock("@src/hooks/useFlowChartState");

describe("UseControlsTabEffects", () => {
  const saveAndRun = jest.fn().mockReturnValue(undefined);
  const setCtrlsManifest = jest.fn();
  const rfInstance = {
    nodes: [],
  };

  beforeEach(() => {
    (useFlowChartState as jest.Mock).mockReturnValue({
      setCtrlsManifest: setCtrlsManifest,
      rfInstance: rfInstance,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ControlsTabEffects should render with Undefined", () => {
    const { result } = renderHook(() => useControlsTabEffects(saveAndRun));
    expect(result.current).toBe(saveAndRun());
  });

  it("setCtrlManifest should be empty if rfInstance has no nodes", () => {
    renderHook(() => useControlsTabEffects(saveAndRun));
    expect(setCtrlsManifest).toHaveBeenCalledWith([]);
  });

  it("setCtrlManifest should not be called if rfInstance has nodes", () => {
    const rfInstanceWithNode = [{ id: 1, type: "start" }];
    (useFlowChartState as jest.Mock).mockReturnValue({
      setCtrlsManifest: setCtrlsManifest,
      rfInstance: rfInstanceWithNode,
    });
    renderHook(() => useControlsTabEffects(saveAndRun));
    expect(setCtrlsManifest).not.toHaveBeenCalled();
  });
});
