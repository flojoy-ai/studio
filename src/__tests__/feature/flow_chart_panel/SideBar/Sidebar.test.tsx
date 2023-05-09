import { fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "@src/feature/flow_chart_panel/SideBar/Sidebar";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

class ResizeObserver {
  observe() {}
  unobserve() {}
}

jest.mock("@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST", () => {
  return {
    COMMANDS: [],
    SECTIONS: [],
  };
});

jest.mock("@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST", () => {
  return {
    FUNCTION_PARAMETERS: {},
  };
});

const mockChildComponent = jest.fn();
jest.mock(
  "@src/feature/flow_chart_panel/SideBar/SidebarSection",
  () => (props) => {
    mockChildComponent(props);
    return <div />;
  }
);

window.ResizeObserver = ResizeObserver as any;

describe("Sidebar", () => {
  it("should renderWithTheme the component correctly", () => {
    const { container } = renderWithTheme(<Sidebar />);
    expect(container).toMatchSnapshot();
  });

  it("checks the add button to be in the document", () => {
    const { getByTestId } = renderWithTheme(<Sidebar />);
    const addButton = getByTestId("add-node-button");

    expect(addButton).toBeInTheDocument();
  });

  it("fires The click event in add node, and checks if the classname of the navbar changes or not", () => {
    const { getByTestId } = renderWithTheme(<Sidebar />);

    const addButton = getByTestId("add-node-button");

    const sidebar = getByTestId("sidebar");
    expect(sidebar).toHaveStyle("left:-100%");

    fireEvent.click(addButton);

    expect(sidebar).toHaveStyle("left:0%");
  });

  it("fires an Input event and checks if the textInput state changes or not", async () => {
    const { getByTestId } = renderWithTheme(<Sidebar />);
    const input: any = getByTestId("sidebar-input");
    fireEvent.change(input, { target: { value: "sine" } });
    expect(input.value).toBe("sine");
  });
});
