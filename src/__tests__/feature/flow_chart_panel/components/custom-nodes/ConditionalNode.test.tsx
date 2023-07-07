import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

const handleRemove = jest.fn();

const props: CustomNodeProps = {
  data: {
    id: "test-id",
    label: "test",
    func: "test",
    type: "test",
    ctrls: {},
    path: "",
    inputs: [
      {
        id: "test",
        name: "test",
        type: "test",
      },
    ],
  },
  handleRemove,
};

jest.mock("@hooks/useFlowChartState");

jest.mock("@feature/flow_chart_panel/components/HandleComponent", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="handle-component" />);
  return { __esModule: true, default: mockChildren };
});

jest.mock("@src/hooks/useSocket");

describe("ConditionalNode", () => {
  it("checks the snapshot", () => {
    const { container } = renderWithTheme(<ConditionalNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it.each([
    ["CONDITIONAL", "conditional-operator-type"],
    ["TIMER", "timer-value"],
    ["LOOP", "loop-info"],
  ])("checks if the component: %p is rendered", (componentName, testId) => {
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

    const { getByTestId } = renderWithTheme(
      <ConditionalNode
        handleRemove={handleRemove}
        data={{ ...props.data, func: componentName, ctrls: ctrls }}
      />
    );

    const component = getByTestId(testId);
    expect(component).toBeInTheDocument();
  });
});
