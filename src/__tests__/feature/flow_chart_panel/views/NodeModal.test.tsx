import NodeModal from "@src/feature/flow_chart_panel/views/NodeModal";
import { NodeModalProps } from "@src/feature/flow_chart_panel/types/NodeModalProps";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

const props: NodeModalProps = {
  modalIsOpen: false,
  closeModal: jest.fn(),
  nodeLabel: "test",
  nodeType: "test",
  nd: {
    cmd: "test",
    id: "test-1",
    result: {
      default_fig: {
        data: [],
      },
    },
  },
  pythonString: "test-python-string",
  nodeFilePath: "test.py",
  selectedNode: null,
};
jest.mock("@src/data/manifests-latest.json", () => {
  return { __esModule: true, default: { commands: [] } };
});

jest.mock("@src/feature/common/PlotlyComponent", () => {
  const mockChild = jest
    .fn()
    .mockReturnValue(<div data-testid="plotly-component"></div>);
  return { __esModule: true, default: mockChild };
});

describe("NodeModal", () => {
  it("checks the snapshot", () => {
    const { container } = renderWithTheme(<NodeModal {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("checks if the mantine modal component is rendered", () => {
    const { getByTestId } = renderWithTheme(<NodeModal {...props} />);

    const component = getByTestId("node-modal");

    expect(component).toBeInTheDocument();
  });
});
