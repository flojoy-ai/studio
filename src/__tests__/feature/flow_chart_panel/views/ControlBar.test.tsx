import { render, screen } from "@testing-library/react";
import Controls from "@src/feature/flow_chart_panel/views/ControlBar";
import { IServerStatus } from "@src/context/socket.context";

// Mock uuid
jest.mock("uuid", () => ({
  v4: () => "randomId",
}));

// Mock useFlowChartState hook
jest.mock("@src/hooks/useFlowChartState", () => ({
  useFlowChartState: () => ({
    isEditMode: false,
    setIsEditMode: jest.fn(),
    rfInstance: null,
    openFileSelector: jest.fn(),
    saveFile: jest.fn(),
    nodes: [],
    setNodes: jest.fn(),
  }),
}));
// Mock useSocket hook
jest.mock("@src/hooks/useSocket", () => ({
  useSocket: () => ({
    states: {
      socketId: "socketId",
      setProgramResults: jest.fn(),
      serverStatus: IServerStatus.CONNECTING,
    },
  }),
}));

// Mock saveFlowChartToLocalStorage, saveAndRunFlowChartInServer, and cancelFlowChartRun functions
jest.mock("@src/services/FlowChartServices", () => ({
  saveFlowChartToLocalStorage: jest.fn(),
  saveAndRunFlowChartInServer: jest.fn(),
  cancelFlowChartRun: jest.fn(),
}));

// Mock AddNodeModal component
jest.mock("@src/feature/flow_chart_panel/views/AddNodeModal", () => ({
  __esModule: true,
  default: jest.fn(() => <div>AddNodeModal</div>),
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
    expect(screen.getByTestId("add-node")).toBeInTheDocument();
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
    expect(screen.getByText("Dropdown")).toBeInTheDocument();
    expect(screen.getByText("AddNodeModal")).toBeInTheDocument();
    expect(container).toMatchSnapshot("__main__");
  });
  it("should show the Add node button when active tab is 'visual'", () => {
    render(
      <Controls theme="dark" activeTab="visual" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.getByTestId("add-node")).toBeInTheDocument();
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
  });

  it("should show the Edit button when active tab is 'panel'", () => {
    render(
      <Controls theme="dark" activeTab="panel" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.queryByTestId("add-node")).not.toBeInTheDocument();
    expect(screen.getByTestId("operation-switch")).toBeInTheDocument();
  });
  it("should not show the Add node or add ctrl button when active tab is 'debug'", () => {
    render(
      <Controls theme="dark" activeTab="debug" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.queryByTestId("add-node")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
  });
});
