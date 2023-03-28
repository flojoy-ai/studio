import { render, screen } from "@testing-library/react";
import Controls from "@src/feature/flow_chart_panel/views/ControlBar";

// Mock useFlowChartState hook
jest.mock("@src/hooks/useFlowChartState");
jest.mock("@src/STATUS_CODES.json", () => {
  return {
    __esModule: true,
    default: {
      RUN_PRE_JOB_OP: "\u23f3 running pre-job operation...",
      RQ_RUN_IN_PROCESS: "\ud83c\udfc3 running script...",
      RQ_RUN_COMPLETE: "\ud83e\udd19 python script run successful",
      MISSING_RQ_RESULTS: "\ud83d\udc7d no result found",
      JOB_IN_RQ: "\ud83c\udfa0 queuing python job: ",
      RQ_RESULTS_RETURNED: "\ud83d\udd14 new results - check RUN REPORT tab",
      STANDBY: "\ud83d\udc22 awaiting a new job",
      SERVER_ONLINE: "\ud83c\udfc1 node server online",
      OFFLINE: "\ud83d\uded1 server offline",
      WORKER_MANAGER_OFFLINE:
        "\ud83d\uded1 worker manager is not running - RUN `npm run worker-manager` from terminal",
      NO_RUNS_YET: "\u26f7\ufe0f No runs yet",
      CONNECTING: "\ud83d\udd04 connecting to the server...",
      PR_JOB_FAILED: "\u274c pre-job operation failed - Re-run script..",
      RM_DOCKER_CONTAINER: "\ud83d\uddd1 removing docker container: ",
      BUILD_DOCKER_CONTAINER: "\u23f3 building docker image for: ",
    },
  };
});
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
    expect(container).toMatchSnapshot("__main__");
  });
  it("should show the Edit button when active tab is 'panel'", () => {
    const { container } = render(
      <Controls theme="dark" activeTab="panel" setOpenCtrlModal={jest.fn()} />
    );
    expect(container).toMatchSnapshot("__switch_btn__");
  });
  it("should not show the Add node or add ctrl button when active tab is 'debug'", () => {
    render(
      <Controls theme="dark" activeTab="debug" setOpenCtrlModal={jest.fn()} />
    );
    expect(screen.queryByTestId("add-ctrl")).not.toBeInTheDocument();
  });
});
