import CustomResultNode from "@src/feature/results_panel/views/CustomResultNode";
import { ResultNodeData } from "@src/feature/results_panel/types/ResultsType";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

jest.mock("reactflow", () => {
  const Handle = jest.fn().mockReturnValue(<div>Handle Component</div>);
  const Position = { Left: "LEFT", Right: "RIGHT" };
  return {
    Handle,
    Position,
  };
});
jest.mock("@src/feature/common/PlotlyComponent", () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <div id={props.id} style={props.style}>
      PlotlyComponent
    </div>
  )),
}));
describe("CustomResultNode", () => {
  const data: ResultNodeData = {
    id: "node-id",
    func: "some function",
    ctrls: {},
    label: "node-label",
    type: "SINE",
    resultData: {
      default_fig: {
        data: [
          {
            type: "bar",
            x: [1, 2, 3],
            y: [4, 5, 6],
          },
        ],
        layout: {
          title: "some title",
        },
      },
      data: {
        type: "ordered_pair",
        x: [1, 2, 3],
        y: [4, 5, 6],
      },
    },
  };
  it("renderWithThemes a PlotlyComponent if result data is provided", () => {
    const { container, getByTestId } = renderWithTheme(
      <CustomResultNode data={data} />
    );
    const resultNode = getByTestId("result-node");
    expect(resultNode).toBeInTheDocument();
    const plotlyComponent = resultNode.querySelector(`#${data.id}`);
    expect(plotlyComponent).toBeInTheDocument();
    expect(plotlyComponent).toHaveStyle({ height: "190px", width: "210px" });
    expect(container).toMatchSnapshot();
  });

  it("renderWithThemes a 'NO Result' message if no result data is provided", () => {
    const { getByText } = renderWithTheme(
      <CustomResultNode data={{ ...data, resultData: undefined }} />
    );
    expect(getByText("NO Result")).toBeInTheDocument();
  });
});
