import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import NodeButtons from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeButtons";

const mockData = {
  id: "test-id",
  label: "test",
  func: "test",
  type: "test",
  ctrls: {},
};

describe("NodeButtons component", () => {
  it("renders correctly with default props", () => {
    const { container } = renderWithTheme(
      <NodeButtons data={mockData} setIsExpandMode={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });
});
