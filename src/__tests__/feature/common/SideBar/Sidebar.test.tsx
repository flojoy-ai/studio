import { AddNodeBtn } from "@src/AddNodeBtn";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import Sidebar from "@src/feature/common/Sidebar/Sidebar";
import { useAddNewNode } from "@src/feature/flow_chart_panel/hooks/useAddNewNode";
import { getManifestCmdsMap } from "@src/utils/ManifestLoader";
import { fireEvent } from "@testing-library/react";
import { useState } from "react";

class ResizeObserver {
  observe() {}
  unobserve() {}
}

jest.mock("@src/utils/ManifestLoader", () => {
  return {
    Commands: {},
    FUNCTION_PARAMETERS: {},
    getManifestCmdsMap: jest.fn(),
  };
});

window.ResizeObserver = ResizeObserver as any;

jest.mock("@src/hooks/useFlowChartState", () => {
  return {
    useFlowChartState: () => {
      return {
        rfInstance: {},
      };
    },
  };
});

jest.doMock("@src/feature/common/Sidebar/Sidebar", () => {
  const SidebarMock = () => {
    const [isSCRIPTSideBarOpen, setSCRIPTSideBarStatus] = useState(false);
    const addNewNode = useAddNewNode(jest.fn(), jest.fn());
    return (
      <>
        <AddNodeBtn setIsSidebarOpen={setSCRIPTSideBarStatus} />
        <Sidebar
          sections={{ title: "ROOT", children: [] }}
          manifestMap={getManifestCmdsMap()}
          leafNodeClickHandler={addNewNode}
          isSideBarOpen={isSCRIPTSideBarOpen}
          setSideBarStatus={setSCRIPTSideBarStatus}
        />
      </>
    );
  };
  return { Sidebar: SidebarMock };
});

const SidebarTest = require("@src/feature/common/Sidebar/Sidebar").Sidebar;

describe("Sidebar", () => {
  it("should render the component correctly", () => {
    const { container } = renderWithTheme(<SidebarTest />);
    expect(container).toMatchSnapshot();
  });

  it("checks the add button to be in the document", () => {
    const { getByTestId } = renderWithTheme(<SidebarTest />);
    const addButton = getByTestId("add-node-button");

    expect(addButton).toBeInTheDocument();
  });

  it("fires The click event in add node, and checks if the classname of the navbar changes or not", () => {
    const { getByTestId } = renderWithTheme(<SidebarTest />);

    const addButton = getByTestId("add-node-button");

    const sidebar = getByTestId("sidebar");
    expect(sidebar).toHaveStyle("left:-100%");

    fireEvent.click(addButton);

    expect(sidebar).toHaveStyle("left:0px");
  });

  it("fires an Input event and checks if the textInput state changes or not", async () => {
    const { getByTestId } = renderWithTheme(<SidebarTest />);
    const input = getByTestId("sidebar-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "sine" } });
    expect(input.value).toBe("sine");
  });
});
