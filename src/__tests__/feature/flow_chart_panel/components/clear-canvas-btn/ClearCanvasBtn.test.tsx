import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import { ClearCanvasBtn } from "@src/feature/flow_chart_panel/components/clear-canvas-btn/ClearCanvasBtn";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { fireEvent, renderHook } from "@testing-library/react";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { Edge, Node } from "reactflow";

const initialNodes: Node<ElementsData>[] = [
  {
    width: 150,
    height: 135,
    id: "1",
    type: "test",
    data: {
      id: "1",
      label: "LINSPACE",
      func: "LINSPACE",
      type: "SIMULATION",
      ctrls: {},
      selected: false,
      path: "path/to/node.py",
    },
    position: {
      x: 0,
      y: 0,
    },
    selected: false,
    positionAbsolute: {
      x: 0,
      y: 0,
    },
    dragging: true,
  },
  {
    width: 150,
    height: 135,
    id: "2",
    type: "test",
    data: {
      id: "2",
      label: "LINSPACE",
      func: "LINSPACE",
      type: "SIMULATION",
      ctrls: {},
      selected: false,
      path: "path/to/node.py",
    },
    position: {
      x: 100,
      y: 100,
    },
    selected: false,
    positionAbsolute: {
      x: 100,
      y: 100,
    },
    dragging: true,
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    type: "straight",
    source: "1",
    target: "2",
    label: "label",
  },
];

const nodesAtom = atomWithImmer(initialNodes);
const edgesAtom = atomWithImmer(initialEdges);

jest.doMock(
  "@src/feature/flow_chart_panel/components/clear-canvas-btn/ClearCanvasBtn",
  () => {
    const ClearCanvasBtnMock = () => {
      const [, setNodes] = useAtom(nodesAtom);
      const [, setEdges] = useAtom(edgesAtom);

      return <ClearCanvasBtn setNodes={setNodes} setEdges={setEdges} />;
    };
    return { ClearCanvasBtn: ClearCanvasBtnMock };
  }
);

const ClearCanvasBtnTest =
  require("@src/feature/flow_chart_panel/components/clear-canvas-btn/ClearCanvasBtn").ClearCanvasBtn;

describe("CanvasClearBtn", () => {
  it("renders correctly with default props", () => {
    const { container } = renderWithTheme(
      <ClearCanvasBtn setNodes={jest.fn()} setEdges={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("clears nodes when clicked", () => {
    const { getByTestId } = renderWithTheme(<ClearCanvasBtnTest />);

    const [nodes] = renderHook(() => useAtom(nodesAtom)).result.current;

    expect(nodes).not.toHaveLength(0);

    const [edges] = renderHook(() => useAtom(edgesAtom)).result.current;
    expect(edges).not.toHaveLength(0);

    const clearButton = getByTestId("clear-canvas-btn");
    fireEvent.click(clearButton);

    const [newNodes] = renderHook(() => useAtom(nodesAtom)).result.current;
    const [newEdges] = renderHook(() => useAtom(edgesAtom)).result.current;

    expect(newNodes).toHaveLength(0);
    expect(newEdges).toHaveLength(0);
  });
});
