import { render } from "@testing-library/react";
import ControlsTab from "@src/feature/controls_panel/ControlsTabView";

// mock `AddCtrlModal`
jest.mock("@src/feature/controls_panel/views/AddCtrlModal", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="add-ctrl-modal"></div>),
}));
// mock `useSocket` hook
jest.mock("@src/hooks/useSocket");

// mock `FlowChartServices`
jest.mock("@src/services/FlowChartServices", () => ({
  saveAndRunFlowChartInServer: jest.fn(),
}));

// mock `ControlGrid` component
jest.mock("@src/feature/controls_panel/views/ControlGrid", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="control-grid"></div>),
}));

// mock `PARAMETERS_MANIFEST`
jest.mock("@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST", () => ({
  FUNCTION_PARAMETERS: {
    ADD: {
      a: { default: 0 },
      b: { default: 0 },
    },
    CONSTANT: {},
  },
}));

describe("ControlsTab", () => {
  it("render ControlsTab correctly.", () => {
    const { container } = render(
      <ControlsTab
        openCtrlModal={false}
        setOpenCtrlModal={jest.fn()}
        results={{}}
        theme="dark"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
