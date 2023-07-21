import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import SidebarCustomContent from "@src/feature/flow_chart_panel/components/SidebarCustomContent";

describe("SidebarCustomContent component", () => {
  it("renders correctly with default props", () => {
    const { container, getByTestId } = renderWithTheme(
      <SidebarCustomContent />
    );
    const reqNodeBtn = getByTestId("request-node-btn");
    expect(reqNodeBtn).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
