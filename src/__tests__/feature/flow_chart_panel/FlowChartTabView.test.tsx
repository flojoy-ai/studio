import FlowChartTab from "@src/feature/flow_chart_panel/FlowChartTabView";
import { FlowChartProps } from "@src/feature/flow_chart_panel/types/FlowChartProps";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

const props: FlowChartProps = {
  results: {
    io: [],
  },
  rfInstance: {
    nodes: [],
    edges: [],
    viewport: {
      x: 1,
      y: 1,
      zoom: 1,
    },
  },
  setRfInstance: jest.fn(),
  clickedElement: undefined,
  setClickedElement: jest.fn(),
};

class ResizeObserver {
  observe() {}
  unobserve() {}
}

class IntersectionObserver {
  constructor() {}

  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
}

jest.mock("@src/feature/flow_chart_panel/views/NodeModal", () => {
  const mockChildren = jest
    .fn()
    .mockReturnValue(<div data-testid="node-modal" />);
  return { __esModule: true, default: mockChildren };
});

jest.mock("@src/services/FlowChartServices", () => {
  return {
    saveFlowChartToLocalStorage: () => jest.fn(),
  };
});

jest.mock("@src/feature/flow_chart_panel/FlowChartTabState", () => {
  return {
    useFlowChartTabState: jest.fn().mockReturnValue({
      windowWidth: 1024,
      modalIsOpen: false,
      setIsModalOpen: jest.fn(),
      openModal: jest.fn(),
      afterOpenModal: jest.fn(),
      closeModal: jest.fn(),
      nd: {},
      setNd: jest.fn(),
      nodeLabel: "PYTHON FUNCTION",
      nodeType: "PYTHON FUNCTION TYPE",
      setNodeLabel: jest.fn(),
      setNodeType: jest.fn(),
      setPythonString: jest.fn(),
      pythonString: "...",
      defaultPythonFnLabel: "PYTHON FUNCTION",
      defaultPythonFnType: "PYTHON FUNCTION TYPE",
    }),
  };
});

jest.mock("@src/feature/flow_chart_panel/FlowChartTabEffects", () => {
  return {
    useFlowChartTabEffects: () => {},
  };
});

jest.mock("@src/configs/NodeConfigs", () => {
  return {
    default: jest.fn(),
  };
});

jest.mock("@src/hooks/useFlowChartState");

jest.mock("@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST", () => {
  return {
    FUNCTION_PARAMETERS: {},
  };
});

window.ResizeObserver = ResizeObserver as any;
window.IntersectionObserver = IntersectionObserver as any;

describe("FlowChartTabView", () => {
  it("should renderWithTheme the component correcty", () => {
    const { container } = renderWithTheme(
      <FlowChartTab
        results={props.results}
        rfInstance={props.rfInstance}
        setRfInstance={props.setRfInstance}
        clickedElement={props.clickedElement}
        setClickedElement={props.setClickedElement}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it.each([
    ["ReactFlow Provider", "react-flow-provider"],
    ["react-flow", "react-flow"],
    ["NodeModal component", "node-modal"],
  ])("should contain %p component", (msg, testId) => {
    const { getByTestId, getAllByTestId } = renderWithTheme(
      <FlowChartTab
        results={props.results}
        rfInstance={props.rfInstance}
        setRfInstance={props.setRfInstance}
        clickedElement={props.clickedElement}
        setClickedElement={props.setClickedElement}
      />
    );

    let component;

    if (testId === "react-flow") {
      component = getAllByTestId(testId);
      expect(component).toHaveLength(2);
    } else {
      component = getByTestId(testId);
      expect(component).toBeInTheDocument();
    }
  });

  it("checks the reactflow style", () => {
    const { getAllByTestId } = renderWithTheme(
      <FlowChartTab
        results={props.results}
        rfInstance={props.rfInstance}
        setRfInstance={props.setRfInstance}
        clickedElement={props.clickedElement}
        setClickedElement={props.setClickedElement}
      />
    );

    const componet = getAllByTestId("react-flow")[0];
    expect(componet).toHaveStyle("height: calc(100vh - 110px)");
  });
});
