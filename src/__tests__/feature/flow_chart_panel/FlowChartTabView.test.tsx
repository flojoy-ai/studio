import { render, fireEvent, waitFor } from "@testing-library/react";
import FlowChartTab from "@src/feature/flow_chart_panel/FlowChartTabView";
import { FlowChartProps } from "@src/feature/flow_chart_panel/types/FlowChartProps";
import { Node, Edge, ReactFlowProvider } from "reactflow";
import NodeModal from "@src/feature/flow_chart_panel/views/NodeModal";

const props: FlowChartProps = {
  results: {
    io: [],
  },
  theme: "dark",
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

// jest.mock("@src/feature/flow_chart_panel/views/NodeModal", () => {
//   return <div></div>,

// });
const mockChildComponent = jest.fn();
jest.mock("@src/feature/flow_chart_panel/views/NodeModal", () => (props) => {
  mockChildComponent(props);
  return <div></div>;
});

// jest.mock('../src/ChildComponent', () => {
//   return {
//     'default': 'ChildComponent'
//   }
// });

// jest.mock("reactflow", () => {
//   const ReactFlow = jest.fn().mockReturnValue(<div data-testid="react-flow" />);
//   const ReactFlowProvider = jest
//     .fn()
//     .mockImplementation(({ children }) => (
//       <div data-testid="react-flow-provider">{children}</div>
//     ));
//   const EdgeTypes = { default: jest.fn() };
//   const NodeTypes = { default: jest.fn() };
//   const ConnectionLineType = { Step: "step" };
//   const OnInit = jest.fn();

//   return {
//     ReactFlow,
//     ReactFlowProvider,
//     EdgeTypes,
//     NodeTypes,
//     ConnectionLineType,
//     OnInit,
//   };
// });

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

jest.mock("@src/hooks/useFlowChartState", () => {
  return {
    useFlowChartState: jest.fn().mockReturnValue({
      nodes: [],
      setNodes: jest.fn(),
      edges: [],
      setEdges: jest.fn(),
    }),
  };
});

const observe = jest.fn();

window.ResizeObserver = ResizeObserver as any;
window.IntersectionObserver = IntersectionObserver as any;

describe("FlowChartTabView", () => {
  it("should render the component correcty", () => {
    const { container } = render(
      <FlowChartTab
        results={props.results}
        theme={props.theme}
        rfInstance={props.rfInstance}
        setRfInstance={props.setRfInstance}
        clickedElement={props.clickedElement}
        setClickedElement={props.setClickedElement}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
