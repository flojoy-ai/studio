import { screen } from "@testing-library/react";
import ControlBar from "@src/feature/flow_chart_panel/views/ControlBar";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

// Mock useFlowChartState hook
jest.mock("@src/hooks/useFlowChartState");
jest.mock("@src/hooks/useControlsState");
// Mock useSocket hook
jest.mock("@src/hooks/useSocket");
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
jest.mock("@src/feature/common/Dropdown", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Dropdown</div>),
}));

jest.mock("react-router-dom");

describe("Controls", () => {
  it("should render correctly", () => {
    const { container } = renderWithTheme(<ControlBar />);

    expect(screen.getByTestId("btn-play")).toBeInTheDocument();
    expect(screen.getByTestId("btn-play")).toBeDisabled();
    expect(screen.queryByTitle("Cancel Run")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
    expect(screen.getByText("Dropdown")).toBeInTheDocument();
    expect(container).toMatchSnapshot("__main__");
  });
  it("should not show the Add node or add ctrl button when active tab is 'debug'", () => {
    renderWithTheme(<ControlBar />);
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
  });
});
