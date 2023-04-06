import { renderHook } from "@testing-library/react-hooks";
import { useControlsTabEffects } from "@src/feature/controls_panel/ControlsTabEffects";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

jest.mock("@src/hooks/useFlowChartState");

describe("UseControlsTabEffects", () => {
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
    const { result } = renderHook(() => useControlsTabEffects());
    expect(result.current).toBe(undefined);
  });

  it("setCtrlManifest should be empty if rfInstance has no nodes", () => {
    renderHook(() => useControlsTabEffects());
    expect(setCtrlsManifest).toHaveBeenCalledWith([]);
  });

  it("setCtrlManifest should not be called if rfInstance has nodes", () => {
    const rfInstanceWithNode = [{ id: 1, type: "start" }];
    (useFlowChartState as jest.Mock).mockReturnValue({
      setCtrlsManifest: setCtrlsManifest,
      rfInstance: { nodes: rfInstanceWithNode },
    });
    renderHook(() => useControlsTabEffects());
    expect(setCtrlsManifest).not.toHaveBeenCalled();
  });
});
