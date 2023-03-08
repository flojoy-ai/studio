import { render } from "@testing-library/react";
import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
const props: CustomNodeProps = {
  data: {
    id: "test-id",
    label: "test",
    func: "test",
    type: "test",
    ctrls: {},
    inputs: [
      {
        id: "test",
        name: "test",
        type: "test",
      },
    ],
  },
};

jest.mock("@hooks/useFlowChartState", () => {
  return {
    useFlowChartState: () => ({
      uiTheme: "dark",
      runningNode: "data-id",
      failedNode: "data-id",
    }),
  };
});

jest.mock("@feature/flow_chart_panel/components/HandleComponent", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="handle-component" />);
  return { __esModule: true, default: mockChildren };
});

jest.mock("@src/hooks/useSocket", () => {
  return {
    useSocket: () => ({
      states: {
        programResults: {},
      },
    }),
  };
});

describe("ConditionalNode", () => {
  it("checks the snapshot", () => {
    const { container } = render(<ConditionalNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it.each([
    ["CONDITIONAL", "conditional-operator-type"],
    ["TIMER", "timer-value"],
    ["LOOP", "loop-info"],
  ])("checks if the componenet: %p is rendered", (componentName, testId) => {
    let ctrls = {};
    if (componentName === "CONDITIONAL") {
      ctrls = {
        operator_type: {
          value: ">",
        },
      };
    } else if (componentName === "TIMER") {
      ctrls = {
        TIMER_test_sleep_time: {
          value: 2,
        },
      };
    }

    const { getByTestId } = render(
      <ConditionalNode
        data={{ ...props.data, func: componentName, ctrls: ctrls }}
      />
    );

    const component = getByTestId(testId);
    expect(component).toBeInTheDocument();
  });
});
