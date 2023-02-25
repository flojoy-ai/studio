import "@testing-library/jest-dom/extend-expect"
import "@testing-library/jest-dom"
import { render, fireEvent } from "@testing-library/react";
// import { expect, it } from "@jest/globals";
// import {expect} from 'expect';
import DropDown from "@src/feature/common/dropdown/DropDown";


describe("DropDown", () => {
  const DropDownBtn = <button>Dropdown Button</button>;
  const children = <div>Dropdown Children</div>;
  it("should render correctly", () => {
    const { container, getByText } = render(
      <DropDown DropDownBtn={DropDownBtn} theme="light">
        {children}
      </DropDown>
    );
    // Check that the button is rendered
    const button = getByText("Click me");
    expect(button).toBeInTheDocument();

    // Check that the dropdown content is not visible
    const dropdownContent = getByText("Dropdown content");
    expect(dropdownContent).not.toBeVisible();
    expect(container).toMatchSnapshot();
  });

  //   it("should open and close on hover", () => {
  //     const { getByText, getByTestId } = render(
  //       <DropDown DropDownBtn={DropDownBtn} theme="light">
  //         {children}
  //       </DropDown>
  //     );
  //     const dropdownWrapper = getByTestId("dropdown-wrapper");
  //     const dropdownContainer = getByTestId("dropdown-container");

  //     // Check that dropdown is closed initially
  //     expect(dropdownContainer).toHaveStyle("opacity: 0");
  //     expect(dropdownContainer).toHaveStyle("z-index: -1");
  //     expect(dropdownContainer).toHaveStyle("transform: translateY(-10%)");

  //     // Open dropdown on mouse enter
  //     fireEvent.mouseEnter(dropdownWrapper);
  //     expect(dropdownContainer).toHaveStyle("opacity: 1");
  //     expect(dropdownContainer).toHaveStyle("z-index: 50");
  //     expect(dropdownContainer).toHaveStyle("transform: translateY(0)");

  //     // Close dropdown on mouse leave
  //     fireEvent.mouseLeave(dropdownWrapper);
  //     expect(dropdownContainer).toHaveStyle("opacity: 0");
  //     expect(dropdownContainer).toHaveStyle("z-index: -1");
  //     expect(dropdownContainer).toHaveStyle("transform: translateY(-10%)");
  //   });
});
