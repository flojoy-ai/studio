import { render, screen } from "@testing-library/react";
import ResultsTab from "@src/feature/results_panel/ResultsTabView";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { Node } from "reactflow";

// jest.mock("@src/hooks/useFlowChartState", () => ({
//   useFlowChartState: jest.fn(() => ({ nodes: [], edges: [] })),
// }));
jest.mock("@src/hooks/useFlowChartState");

jest.mock("@src/feature/results_panel/ResultsTabEffects", () => ({
  useResultsTabEffects: jest.fn(),
}));

// jest.mock("@src/feature/results_panel/ResultsTabState", () => ({
//   useResultsTabState: jest.fn(() => ({
//     setResultNodes: jest.fn(),
//     resultNodes: [] as Node[],
//     nodes: [] as Node[],
//   })),
// }));
jest.mock("reactflow", () => {
  const ReactFlow = jest.fn().mockReturnValue(<div data-testid="react-flow" />);
  const ReactFlowProvider = jest
    .fn()
    .mockImplementation(({ children }) => (
      <div data-testid="react-flow-provider">{children}</div>
    ));
  const EdgeTypes = { default: jest.fn() };
  const NodeTypes = { default: jest.fn() };
  const ConnectionLineType = { Step: "step" };
  const OnInit = jest.fn();

  return {
    ReactFlow,
    ReactFlowProvider,
    EdgeTypes,
    NodeTypes,
    ConnectionLineType,
    OnInit,
  };
});

jest.mock("@src/feature/results_panel/views/CustomResultNode", () => {
  return <div></div>;
});
jest.mock("@src/feature/flow_chart_panel/views/CustomEdge", () => {
  return <div></div>;
});
jest.mock("react-use", () => ({
  useWindowSize: jest.fn(() => ({ width: 1024, height: 768 })),
}));

describe("ResultsTab component", () => {
  const results: ResultsType = {
    io: [],
  };

  it("renders the ResultsTab component", () => {
    render(<ResultsTab results={results} />);

    const reactFlowComponent = screen.getByTestId("results-flow");
    expect(reactFlowComponent).toBeInTheDocument();
    expect(screen.getByTestId("react-flow")).toBeInTheDocument();

    expect(reactFlowComponent).toHaveAttribute("style", "height: 99vh;");
    expect(reactFlowComponent).toMatchSnapshot();
  });
});
