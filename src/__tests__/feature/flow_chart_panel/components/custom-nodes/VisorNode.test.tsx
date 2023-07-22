import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";
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
        desc: null,
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

describe("VisorNode", () => {
  it("checks the snapshot", () => {
    const { container } = renderWithTheme(<VisorNode {...props} />);
    expect(container).toMatchSnapshot();
  });
  it.each([
    ["SCATTER", "scatter-svg"],
    ["HISTOGRAM", "histogram-svg"],
    ["LINE", "line-svg"],
    ["SURFACE3D", "surface3D-svg"],
    ["SCATTER3D", "scatter3d-svg"],
    ["BAR", "barchart-svg"],
  ])("should contain component: %p", (functionName, testId) => {
    const { getByTestId } = renderWithTheme(
      <VisorNode
        data={{ ...props.data, func: functionName }}
        handleRemove={handleRemove}
      />
    );

    const component = getByTestId(testId);

    expect(component).toBeInTheDocument();
  });
});
