import { screen } from "@testing-library/react";
import ResultsTab from "@src/feature/results_panel/ResultsTabView";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

jest.mock("@src/hooks/useFlowChartState");
jest.mock("@src/hooks/useControlsState");

jest.mock("@src/feature/results_panel/ResultsTabEffects", () => ({
  useResultsTabEffects: jest.fn(),
}));

jest.mock("@src/feature/results_panel/ResultsTabState", () => ({
  useResultsTabState: jest.fn(() => ({
    setResultNodes: jest.fn(),
    resultNodes: [] as Node[],
    nodes: [] as Node[],
  })),
}));

jest.mock("@src/feature/results_panel/views/CustomResultNode", () => {
  return <div></div>;
});
jest.mock("@src/feature/flow_chart_panel/views/CustomEdge", () => {
  return <div></div>;
});
jest.mock("react-use", () => ({
  useWindowSize: jest.fn(() => ({ width: 1024, height: 768 })),
}));

jest.mock("@src/hooks/useSocket");

describe("ResultsTab component", () => {
  const results: ResultsType = {
    io: [],
  };

  it("renders the ResultsTab component", () => {
    renderWithTheme(<ResultsTab />);

    const reactFlowComponent = screen.getByTestId("results-flow");
    expect(reactFlowComponent).toBeInTheDocument();
    expect(screen.getByTestId("react-flow")).toBeInTheDocument();

    expect(reactFlowComponent).toHaveAttribute(
      "style",
      "height: calc(100vh - 110px);"
    );
    expect(reactFlowComponent).toMatchSnapshot();
  });
});
