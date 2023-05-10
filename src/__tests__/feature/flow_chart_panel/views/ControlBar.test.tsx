import { render, screen } from "@testing-library/react";
import Controls from "@src/feature/flow_chart_panel/views/ControlBar";

// Mock useFlowChartState hook
jest.mock("@src/hooks/useFlowChartState");
// Mock useSocket hook
jest.mock("@src/hooks/useSocket");
jest.mock("react-switch", () => ({
  __esModule: true,
  default: jest.fn(() => {
    return <div data-testid="react-switch" />;
  }),
}));
jest.mock("react-modal");
// Mock saveFlowChartToLocalStorage, saveAndRunFlowChartInServer, and cancelFlowChartRun functions
jest.mock("@src/services/FlowChartServices", () => ({
  saveFlowChartToLocalStorage: jest.fn(),
  saveAndRunFlowChartInServer: jest.fn(),
  cancelFlowChartRun: jest.fn(),
}));

// Mock KeyboardShortcutModal component
jest.mock("@src/feature/flow_chart_panel/views/KeyboardShortcutModal", () => ({
  __esModule: true,
  default: jest.fn(() => <div>KeyboardShortcutModal</div>),
}));
// Mock DropDown component
jest.mock("@src/feature/common/dropdown/DropDown", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Dropdown</div>),
}));

describe("Controls", () => {
  it("should render correctly", () => {
    const { container } = render(
      <Controls theme="dark" activeTab="visual" setOpenCtrlModal={jest.fn()} />
    );

    expect(screen.getByTestId("btn-play")).toBeInTheDocument();
    expect(screen.getByTestId("btn-play")).toBeDisabled();
    expect(screen.queryByTitle("Cancel Run")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
    expect(screen.getByText("Dropdown")).toBeInTheDocument();
    expect(container).toMatchSnapshot("__main__");
  });
  it("should show the Edit button when active tab is 'panel'", () => {
    const { container } = render(
      <Controls theme="dark" activeTab="panel" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.getByTestId("operation-switch")).toBeInTheDocument();
    expect(screen.getByTestId("react-switch")).toBeInTheDocument();
    expect(container).toMatchSnapshot("__switch_btn__");
  });
  it("should not show the Add node or add ctrl button when active tab is 'debug'", () => {
    render(
      <Controls theme="dark" activeTab="debug" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
  });
});
