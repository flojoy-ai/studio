import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import ArithmeticNode from "@src/feature/flow_chart_panel/components/custom-nodes/ArithmeticNode";
import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";

const props: CustomNodeProps = {
  data: { id: "test-id", label: "test", func: "test", type: "test", ctrls: {} },
};

jest.mock("@hooks/useFlowChartState");

jest.mock("@feature/flow_chart_panel/components/HandleComponent", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="handle-component" />);
  return { __esModule: true, default: mockChildren };
});

describe("ArithmeticNode", () => {
  it("checks the snapshot", () => {
    const { container } = renderWithTheme(<ArithmeticNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it.each([
    ["MULTIPLY", "multiply-svg"],
    ["ADD", "add-svg"],
    ["SUBTRACT", "sub-svg"],
    ["default", "default-svg"],
    ["handle", "handle-component"],
  ])("checks if component: %p in the document", (funcName, testId) => {
    let component;

    if (funcName !== "default") {
      const { getByTestId } = renderWithTheme(
        <ArithmeticNode data={{ ...props.data, func: funcName }} />
      );
      component = getByTestId(testId);
    } else {
      const { getByTestId } = renderWithTheme(<ArithmeticNode {...props} />);
      component = getByTestId(testId);
    }

    expect(component).toBeInTheDocument();
  });
});
