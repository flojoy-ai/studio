import { render } from "@testing-library/react";
import CustomResultNode from "@src/feature/results_panel/views/CustomResultNode";
import { ResultNodeData } from "@src/feature/results_panel/types/ResultsType";

jest.mock("@src/hooks/useFlowChartState", () => ({
  useFlowChartState: jest.fn(() => ({ uiTheme: "dark" })),
}));
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
    <div
      id={props.id}
      style={props.style}
      data-imgsource={
        props.data.length > 0 && props.data[0].source && props.data[0].source
      }
    >
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
      type: "bar",
      x: [1, 2, 3],
      y: [4, 5, 6],
      layout: {
        title: "some title",
      },
    },
  };
  it("renders a PlotlyComponent if result data is provided", () => {
    const { container, getByTestId } = render(<CustomResultNode data={data} />);
    const resultNode = getByTestId("result-node");
    expect(resultNode).toBeInTheDocument();
    const plotlyComponent = resultNode.querySelector(`#${data.id}`);
    expect(plotlyComponent).toBeInTheDocument();
    expect(plotlyComponent).toHaveStyle({ height: "190px", width: "210px" });
    expect(container).toMatchSnapshot();
  });

  it("renders a 'NO Result' message if no result data is provided", () => {
    const { getByText } = render(
      <CustomResultNode data={{ ...data, resultData: undefined }} />
    );
    expect(getByText("NO Result")).toBeInTheDocument();
  });

  it("converts image result data to a data URL", () => {
    const modifiedData: ResultNodeData = {
      ...data,
      resultData: {
        type: "image",
        y: [[1, 2, 3]],
        file_type: ["image"],
      },
    };
    const { container, getByTestId } = render(
      <CustomResultNode data={modifiedData} />
    );
    const resultNode = getByTestId("result-node");
    const plotlyComponent = resultNode.querySelector(`#${modifiedData.id}`);
    expect(plotlyComponent).toBeInTheDocument();
    expect(container).toMatchSnapshot("__image_type_file__");
    expect(plotlyComponent).toHaveAttribute(
      "data-imgsource",
      "data:image/jpeg;base64," +
        Buffer.from(
          (modifiedData.resultData?.y![0] as number[]) || []
        ).toString("base64")
    );
  });
});
