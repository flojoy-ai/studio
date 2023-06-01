import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import Dropdown from "@src/feature/common/DropDown";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent } from "@testing-library/react";

describe("DropDown", () => {
  const DropDownBtn = <button>Dropdown Button</button>;
  const children = <div>Dropdown Children</div>;
  it("should render correctly", () => {
    const { container, getByText, getByTestId } = renderWithTheme(
      <Dropdown dropdownBtn={DropDownBtn}>{children}</Dropdown>
    );
    // Check that the button is rendered
    const button = getByText("Dropdown Button");
    expect(button).toBeInTheDocument();

    // Check that the dropdown content is not visible
    const dropdownContent = getByTestId("dropdown-container");
    expect(container).toMatchSnapshot();
  });

  it("should open and close on hover", () => {
    const { getByTestId } = renderWithTheme(
      <Dropdown dropdownBtn={DropDownBtn}>{children}</Dropdown>
    );
    const dropdownWrapper = getByTestId("dropdown-wrapper");
    const dropdownContainer = getByTestId("dropdown-container");

    // Open dropdown on mouse enter
    fireEvent.mouseEnter(dropdownWrapper);
    expect(dropdownContainer).toHaveStyle("opacity: 1");
    expect(dropdownContainer).toHaveStyle("z-index: 50");
    expect(dropdownContainer).toHaveStyle("transform: translateY(0)");

    // Close dropdown on mouse leave
    fireEvent.mouseLeave(dropdownWrapper);
    expect(dropdownContainer).toHaveStyle("opacity: 0");
    expect(dropdownContainer).toHaveStyle("z-index: -1");
    expect(dropdownContainer).toHaveStyle("transform: translateY(-10%)");
  });
});
