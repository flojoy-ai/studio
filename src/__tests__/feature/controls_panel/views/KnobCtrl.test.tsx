import KnobCtrl, {
  KnobCtrlProps,
} from "@src/feature/controls_panel/views/KnobCtrl";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

const testKnobCtr: KnobCtrlProps = {
  makeLayoutStatic: jest.fn(),
  isEditMode: false,
  ctrlObj: {
    id: "plot-control",
    name: "Plot Control",
    type: "plot",
    minHeight: 10,
    minWidth: 10,
    layout: { i: "asd", x: 34, y: 34, w: 23, h: 3 },
    val: 30,
  },
  selectedOption: undefined,
  setGridLayout: jest.fn(),
  updateCtrlValue: jest.fn(),
  currentInputValue: 10,
};

jest.mock("@src/utils/SilverKnob", () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue(<></>),
  };
});

describe("KnobCtrl Component test", () => {
  it("KnobCtrl should render with Props", () => {
    const { container } = render(<KnobCtrl {...testKnobCtr} />);
    expect(container).toMatchSnapshot();
  });

  it("KnobCtrl should render with Props", () => {
    render(<KnobCtrl {...testKnobCtr} />);
    const outlineDiv = screen.getByTestId("KnobCtrlDiv");
    user.hover(outlineDiv);
    expect(testKnobCtr.makeLayoutStatic).toBeCalled();
  });
});
