import { renderHook } from "@testing-library/react";
import { useControlsTabEffects } from "@src/feature/controls_panel/ControlsTabEffects";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useControlsState } from "@src/hooks/useControlsState";

jest.mock("@src/hooks/useControlsState");
jest.mock("@src/hooks/useFlowChartGraph");
jest.mock("@src/utils/ManifestLoader");

describe("UseControlsTabEffects", () => {
  const setCtrlsManifest = jest.fn();
  const rfInstance = {
    nodes: [],
  };

  beforeEach(() => {
    (useControlsState as jest.Mock).mockReturnValue({
      setCtrlsManifest: setCtrlsManifest,
    });
    (useFlowChartGraph as jest.Mock).mockReturnValue({
      rfInstance: rfInstance,
      nodes: [],
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
    (useFlowChartGraph as jest.Mock).mockReturnValue({
      nodes: rfInstanceWithNode,
    });
    renderHook(() => useControlsTabEffects());
    expect(setCtrlsManifest).not.toHaveBeenCalled();
  });
});
