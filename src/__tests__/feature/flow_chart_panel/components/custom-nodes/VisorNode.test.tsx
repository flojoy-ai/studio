import { render } from "@testing-library/react";
import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";

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

jest.mock("@hooks/useFlowChartState");


jest.mock("@feature/flow_chart_panel/components/HandleComponent", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="handle-component" />);
  return { __esModule: true, default: mockChildren };
});

describe("VisorNode", () => {
  it("checks the snapshot", () => {
    const { container } = render(<VisorNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it.each([
    ["SCATTER", "scatter-svg"],
    ["HISTOGRAM", "histogram-svg"],
    ["LINE", "line-svg"],
    ["SURFACE3D", "surface3D-svg"],
    ["SCATTER3D", "scatter-svg"],
    ["BAR", "barchart-svg"],
  ])("should contain component: %p", (functionName, testId) => {
    const { getByTestId } = render(
      <VisorNode data={{ ...props.data, func: functionName }} />
    );

    const component = getByTestId(testId);

    expect(component).toBeInTheDocument();
  });
});
