import FlowChartTab from "@src/feature/flow_chart_panel/FlowChartTabView";
import { FlowChartProps } from "@src/feature/flow_chart_panel/types/FlowChartProps";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import { CMND_MANIFEST_MAP } from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";

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

jest.mock("@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST", () => {
  return {
    CMND_TREE: { title: "ROOT", child: [] },
    CMND_MANIFEST_MAP: {},
  };
});

jest.mock("@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST", () => {
  return {
    FUNCTION_PARAMETERS: {},
  };
});

jest.mock("@src/hooks/useSocket", () => {
  return {
    useSocket: () => ({
      states: {
        programResults: {},
      },
    }),
  };
});

jest.mock("react-router-dom", () => {
  return {
    __esModule: true,
    useLocation: jest.fn().mockReturnValue({
      pathname: "/",
    }),
    useSearchParams: jest.fn().mockReturnValue([new Map(), jest.fn()]),
    Link: ({
      to,
      children,
      testId,
    }: {
      to: string;
      children: React.ReactNode;
      testId: string;
    }) => <div>{children}</div>,
  };
});

window.ResizeObserver = ResizeObserver as any;
window.IntersectionObserver = IntersectionObserver as any;

describe("FlowChartTabView", () => {
  it("should render the component correcty", () => {
    const { container } = renderWithTheme(<FlowChartTab />);
    expect(container).toMatchSnapshot();
  });

  it.each([
    ["ReactFlow Provider", "react-flow-provider"],
    ["react-flow", "react-flow"],
    ["NodeModal component", "node-modal"],
  ])("should contain %p component", (msg, testId) => {
    const { getByTestId, getAllByTestId } = renderWithTheme(<FlowChartTab />);

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
    const { getAllByTestId } = renderWithTheme(<FlowChartTab />);

    const componet = getAllByTestId("react-flow")[0];
    expect(componet).toHaveStyle("height: calc(100vh - 110px)");
  });
});
