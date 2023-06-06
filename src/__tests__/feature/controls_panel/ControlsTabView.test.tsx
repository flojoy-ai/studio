import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import ControlsTab from "@src/feature/controls_panel/ControlsTabView";
import { Settings } from "http2";

// mock `AddCtrlModal`

jest.mock("@src/hooks/useSettings", () => {
  return {
    useSettings: () => {
      return {
        settingsList: [{} as Settings],
      };
    },
  };
});

jest.mock("@src/feature/controls_panel/views/AddCtrlModal", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="add-ctrl-modal"></div>),
}));
// mock `useSocket` hook
jest.mock("@src/hooks/useSocket");
jest.mock("@src/hooks/useControlsState");

jest.mock("@src/services/FlowChartServices", () => {
  return {
    saveAndRunFlowChartInServer: jest.fn(),
  };
});

// mock `ControlGrid` component
jest.mock("@src/feature/controls_panel/views/ControlGrid", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="control-grid"></div>),
}));

// mock `PARAMETERS_MANIFEST`
jest.mock("@src/utils/ManifestLoader", () => ({
  FUNCTION_PARAMETERS: {
    ADD: {
      a: { default: 0 },
      b: { default: 0 },
    },
    CONSTANT: {},
  },
  getManifestParams : jest.fn()
}));

class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver;

describe("ControlsTab", () => {
  it("render ControlsTab correctly.", () => {
    const { container } = renderWithTheme(<ControlsTab />);
    expect(container).toMatchSnapshot();
  });
});
