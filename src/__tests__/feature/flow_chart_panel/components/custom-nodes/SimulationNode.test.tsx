import SimulationNode from "@src/feature/flow_chart_panel/components/custom-nodes/SimulationNode";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

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

jest.mock("@src/hooks/useFlowChartState");

jest.mock("@feature/flow_chart_panel/components/HandleComponent", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="handle-component" />);
  return { __esModule: true, default: mockChildren };
});

jest.mock("@src/hooks/useSocket");

describe("ConditionalNode", () => {
  it("checks the snapshot", () => {
    const { container } = renderWithTheme(<SimulationNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("should contain the data label text", () => {
    const { container, getByText } = renderWithTheme(
      <SimulationNode {...props} />
    );
    const textField = getByText(props.data.label);
    expect(textField).toBeInTheDocument();
  });
  it("check if the handle component rendered", () => {
    const { getByTestId } = renderWithTheme(<SimulationNode {...props} />);
    const component = getByTestId("handle-component");
    expect(component).toBeInTheDocument();
  });
});
