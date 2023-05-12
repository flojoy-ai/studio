import { screen } from "@testing-library/react";
import Controls from "@src/feature/flow_chart_panel/views/ControlBar";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

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
jest.mock("@src/feature/common/DropDown", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Dropdown</div>),
}));

describe("Controls", () => {
  it("should renderWithTheme correctly", () => {
    const { container } = renderWithTheme(
      <Controls activeTab="visual" setOpenCtrlModal={jest.fn()} />
    );

    expect(screen.getByTestId("btn-play")).toBeInTheDocument();
    expect(screen.getByTestId("btn-play")).toBeDisabled();
    expect(screen.queryByTitle("Cancel Run")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
    expect(screen.getByText("Dropdown")).toBeInTheDocument();
    expect(container).toMatchSnapshot("__main__");
  });
  it("should not show the Add node or add ctrl button when active tab is 'debug'", () => {
    renderWithTheme(
      <Controls activeTab="debug" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
  });
});
