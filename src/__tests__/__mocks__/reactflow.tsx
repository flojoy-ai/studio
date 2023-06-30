const ReactFlow = jest.fn().mockReturnValue(<div data-testid="react-flow" />);
const ReactFlowProvider = jest
  .fn()
  .mockImplementation(({ children }) => (
    <div data-testid="react-flow-provider">{children}</div>
  ));
const EdgeTypes = { default: jest.fn() };
const NodeTypes = { default: jest.fn() };
const OnInit = jest.fn();
const useOnSelectionChange = jest.fn();

const returnValues = {
  ReactFlowProvider,
  EdgeTypes,
  NodeTypes,
  ConnectionLineType: {
    Bezier: "default",
    Straight: "straight",
    Step: "step",
    SmoothStep: "smoothstep",
    SimpleBezier: "simplebezier",
  },
  OnInit,
  useOnSelectionChange,
  ReactFlow,
  useReactFlow: jest.fn(() => {
    return { zoomIn: jest.fn(), zoomOut: jest.fn(), fitView: jest.fn() };
  }),
  MiniMap: jest.fn(({ children }) => (
    <div data-testid="reactflow-minimap">{children}</div>
  )),
};

module.exports = returnValues;
