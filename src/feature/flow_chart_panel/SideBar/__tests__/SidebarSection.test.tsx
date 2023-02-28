import {
  render,
  fireEvent,
  waitFor,
  getAllByTestId,
} from "@testing-library/react";
import SidebarSection from "../SidebarSection";

class ResizeObserver {
  observe() {}
  unobserve() {}
}

const items = {
  title: "test",
  child: [{ name: "test", key: "test" }],
};

const onAdd = jest.fn();

jest.mock("../../manifest/COMMANDS_MANIFEST", () => {
  return {
    COMMANDS: [],
    SECTIONS: [],
  };
});

jest.mock("../../manifest/PARAMETERS_MANIFEST", () => {
  return {
    FUNCTION_PARAMETERS: {},
  };
});

jest.mock("../../../../hooks/useFlowChartState", () => {
  return {
    useFlowChartState: () => {
      return {
        setNodes: jest.fn(),
      };
    },
  };
});

jest.mock("uuid", () => {
  return {
    v4: jest.fn(),
  };
});

describe("SidebarSection", () => {
  window.ResizeObserver = ResizeObserver as any;
  it("matches snapshot", () => {
    const { container } = render(
      <SidebarSection title={items.title} child={items.child} />
    );
    expect(container).toMatchSnapshot();
  });
  it("checks the section button in document", () => {
    const { getByTestId } = render(
      <SidebarSection title={items.title} child={items.child} />
    );
    const button = getByTestId("sidebar-subsection-button");
    expect(button).toBeInTheDocument();
  });
  it("checks if the collapse tab is open when the button is clicked", () => {
    const { getByTestId } = render(
      <SidebarSection title={items.title} child={items.child} />
    );
    const sectionButton = getByTestId("sidebar-subsection-button");
    const collapseButton = getByTestId("sidebar-subsection-collapse");

    expect(collapseButton).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(sectionButton);

    expect(collapseButton).toHaveAttribute("aria-hidden", "false");
  });
});
