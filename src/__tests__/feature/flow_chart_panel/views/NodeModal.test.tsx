import NodeModal from "@src/feature/flow_chart_panel/views/NodeModal";
import { NodeModalProps } from "@src/feature/flow_chart_panel/types/NodeModalProps";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

const props: NodeModalProps = {
  modalIsOpen: false,
  afterOpenModal: jest.fn(),
  closeModal: jest.fn(),
  modalStyles: {},
  nodeLabel: "test",
  nodeType: "test",
  nd: {
    cmd: "test",
    id: "test-1",
    result: {
      data: {
        type: "ordered_pair",
      },
      default_fig: {
        data: [],
      },
    },
  },
  pythonString: "test-python-string",
  defaultLayout: undefined,
  clickedElement: {},
};

jest.mock("@src/feature/common/PlotlyComponent", () => {
  const mockChild = jest
    .fn()
    .mockReturnValue(<div data-testid="plotly-component"></div>);
  return { __esModule: true, default: mockChild };
});

jest.mock("react-modal", () => {
  const ReactModal = jest
    .fn()
    .mockReturnValue(<div data-testid="react-modal" />);
  return {
    default: ReactModal,
  };
});

describe("NodeModal", () => {
  it("checks the snapshot", () => {
    const { container } = renderWithTheme(<NodeModal {...props} />);
    expect(container).toMatchSnapshot();
  });
  it("checks if the react modal component is rendered", () => {
    const { container, getByTestId } = renderWithTheme(
      <NodeModal {...props} />
    );

    const component = getByTestId("react-modal");

    expect(component).toBeInTheDocument();
  });
});
