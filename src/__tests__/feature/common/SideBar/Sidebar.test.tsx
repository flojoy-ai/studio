import { fireEvent, waitFor } from "@testing-library/react";
import { SidebarCustom } from "@src/feature/common/Sidebar/Sidebar";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import { useAddNewNode } from "@src/feature/flow_chart_panel/hooks/useAddNewNode";
import { useState } from "react";
import {
  CMND_MANIFEST,
  CMND_TREE,
} from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import React from "react";
import { AddNodeBtn } from "@src/AddNodeBtn";

class ResizeObserver {
  observe() {}
  unobserve() {}
}

jest.mock("@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST", () => {
  return {
    Commmands: {},
  };
});

jest.mock("@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST", () => {
  return {
    FUNCTION_PARAMETERS: {},
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
    const [isSCRIPTSideBarOpen, setSCRIPTSideBarStatus] = useState(false); //for script sidebar
    const addNewNode = useAddNewNode();
    return (
      <>
        <AddNodeBtn
          setSCRIPTSideBarStatus={setSCRIPTSideBarStatus}
          isSCRIPTSideBarOpen={isSCRIPTSideBarOpen}
        />
        <SidebarCustom
          sections={{ title: "ROOT", child: [] }}
          manifestMap={CMND_MANIFEST}
          leafNodeClickHandler={addNewNode}
          isSideBarOpen={isSCRIPTSideBarOpen}
          setSideBarStatus={setSCRIPTSideBarStatus}
        />
      </>
    );
  };
  return { SidebarCustom: SidebarMock };
});

const SidebarTest =
  require("@src/feature/common/Sidebar/Sidebar").SidebarCustom;

describe("Sidebar", () => {
  it("should render the component correctly", () => {
    console.log(SidebarTest);
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

    expect(sidebar).toHaveStyle("left:0%");
  });

  it("fires an Input event and checks if the textInput state changes or not", async () => {
    const { getByTestId } = renderWithTheme(<SidebarTest />);
    const input: any = getByTestId("sidebar-input");
    fireEvent.change(input, { target: { value: "sine" } });
    expect(input.value).toBe("sine");
  });
});
