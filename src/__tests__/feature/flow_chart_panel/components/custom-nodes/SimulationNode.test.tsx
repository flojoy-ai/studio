import { render } from "@testing-library/react";
import SimulationNode from "@src/feature/flow_chart_panel/components/custom-nodes/SimulationNode";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";

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

jest.mock("@feature/flow_chart_panel/components/HandleComponent", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="handle-component" />);
  return { __esModule: true, default: mockChildren };
});

describe("ConditionalNode", () => {
  it("checks the snapshot", () => {
    const { container } = render(<SimulationNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("should contain the data label text", () => {
    const { container, getByText } = render(<SimulationNode {...props} />);
    const textField = getByText(props.data.label);
    expect(textField).toBeInTheDocument();
  });
  it("check if the handle component rendered", () => {
    const { getByTestId } = render(<SimulationNode {...props} />);
    const component = getByTestId("handle-component");
    expect(component).toBeInTheDocument();
  });
});
