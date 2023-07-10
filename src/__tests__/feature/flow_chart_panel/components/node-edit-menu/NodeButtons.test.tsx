import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import NodeButtons from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeButtons";
import { fireEvent } from "@testing-library/dom";
import { useState } from "react";

const mockData = {
  id: "test-id",
  label: "test",
  func: "test",
  type: "test",
  ctrls: {},
  path: "",
};

const handleRemove = jest.fn();

jest.doMock(
  "@src/feature/flow_chart_panel/components/node-edit-menu/NodeButtons",
  () => {
    const NodeButtonsMock = () => {
      const [modalOpen, setModalOpen] = useState(false);
      return (
        <>
          {modalOpen && <div data-testid="node-modal" />}
          <NodeButtons
            handleRemove={handleRemove}
            data={mockData}
            setIsExpandMode={setModalOpen}
          />
        </>
      );
    };
    return { NodeButtons: NodeButtonsMock };
  }
);

const NodeButtonsTest =
  require("@src/feature/flow_chart_panel/components/node-edit-menu/NodeButtons").NodeButtons;

describe("NodeButtons component", () => {
  it("renders correctly with default props", () => {
    const { container } = renderWithTheme(
      <NodeButtons
        handleRemove={handleRemove}
        data={mockData}
        setIsExpandMode={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("opens modal when expand button is clicked", () => {
    const { getByTestId } = renderWithTheme(<NodeButtonsTest />);
    const expandButton = getByTestId("expand-button");

    fireEvent.click(expandButton);

    const modal = getByTestId("node-modal");
    expect(modal).toBeInTheDocument();
  });
});
