import "@testing-library/jest-dom/extend-expect"
import "@testing-library/jest-dom"
import { render, fireEvent } from "@testing-library/react";
import DropDown from "@src/feature/common/dropdown/DropDown"; 

const theme = "light";
describe("DropDown", () => {
  const DropDownBtn = <button>Dropdown Button</button>;
  const children = <div>Dropdown Children</div>;
  it("should render correctly", () => {
    const { container, getByText, getByTestId } = render(
      <DropDown DropDownBtn={DropDownBtn} theme={theme}>
        {children}
      </DropDown>
    );
    // Check that the button is rendered
    const button = getByText("Dropdown Button");
    expect(button).toBeInTheDocument();

    // Check that the dropdown content is not visible
    const dropdownContent = getByTestId("dropdown-container");
    expect(dropdownContent).toHaveClass("dropdown__container", theme)
    expect(container).toMatchSnapshot();
  });

    it("should open and close on hover", () => {
      const { getByTestId } = render(
        <DropDown DropDownBtn={DropDownBtn} theme={theme}>
          {children}
        </DropDown>
      );
      const dropdownWrapper = getByTestId("dropdown-wrapper");
      const dropdownContainer = getByTestId("dropdown-container");

      // Check that dropdown is closed initially
      expect(dropdownContainer).toHaveClass("dropdown__container");
      
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
