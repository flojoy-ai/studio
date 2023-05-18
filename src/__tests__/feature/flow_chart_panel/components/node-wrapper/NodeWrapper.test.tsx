import NodeWrapper from "@src/feature/flow_chart_panel/components/NodeWrapper";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import { fireEvent } from "@testing-library/react";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { ParamValueType } from "@feature/common/types/ParamValueType";

jest.mock("@src/hooks/useFlowChartState");
jest.mock("@src/hooks/useSocket");

const elementData: ElementsData = {
  ctrls: {
    first_param: {
      functionName: "node-123",
      param: "first_param",
      value: "10",
      ValType: ParamValueType.int,
    },
  },
  func: "Rand",
  id: "test-123",
  label: "Rand",
  type: "Default",
};

describe("NodeWrapper component", () => {
  it("Should render the component and match snapshot.", () => {
    const { container } = renderWithTheme(
      <NodeWrapper data={elementData}>
        <div></div>
      </NodeWrapper>
    );
    fireEvent.mouseEnter(container);
    expect(container).toMatchSnapshot();
  });
  it("Given failedNode equals to node id and failureReason, should render error popup on hover.", () => {
    const errorMessage = "Unexpected error occured!";
    (useSocket as jest.Mock).mockReturnValue({
      states: {
        failureReason: errorMessage,
      },
    });
    (useFlowChartState as jest.Mock).mockReturnValue({
      failedNode: "test-123",
    });
    const { getByTestId } = renderWithTheme(
      <NodeWrapper data={elementData}>
        <div></div>
      </NodeWrapper>
    );
    const nodeWrapper = getByTestId("node-wrapper");
    fireEvent.mouseEnter(nodeWrapper);
    const errorPopupElem = getByTestId("node-error-popup");
    expect(errorPopupElem).toBeInTheDocument();
    expect(errorPopupElem).toHaveTextContent(errorMessage);
  });
});
