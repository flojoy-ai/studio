import { getByTestId, render } from "@testing-library/react";
import Control from "@src/feature/controls_panel/views/Control";
import { ControlProps } from "@src/feature/controls_panel/types/ControlProps";
import { CtlManifestType } from "@src/hooks/useFlowChartState";
import ControlComponent from "@src/feature/controls_panel/views/control-component/ControlComponent";

jest.mock("@src/hooks/useFlowChartState");

const controlProps: ControlProps = {
  isEditMode: true,
  theme: "dark",
  results: {},
  updateCtrlValue: jest.fn(),
  attachParamsToCtrl: jest.fn(),
  removeCtrl: jest.fn(),
  setCurrentInput: jest.fn(),
  setOpenEditModal: jest.fn(),
};
const ctrl: CtlManifestType = {
  id: "test-ctrl",
  minHeight: 110,
  minWidth: 150,
  name: "Test ctrl",
  type: "input",
  hidden: false,
  layout: {
    h: 12,
    w: 12,
    i: "test-id",
    x: 10,
    y: 10,
  },
};

// mock `ControlComponent`
jest.mock(
  "@src/feature/controls_panel/views/control-component/ControlComponent",
  () => ({
    __esModule: true,
    default: jest.fn((props) => {
      return (
        <div data-testid="control-component" data-props={JSON.stringify(props)}>
          Control Component
        </div>
      );
    }),
  })
);
describe("Control.tsx", () => {
  it("render Control component correctly.", () => {
    const { container } = render(
      <Control controlProps={controlProps} ctrl={ctrl} />
    );
    expect(getByTestId(container, "ctrl-grid-item")).toHaveClass("ctrl-input");
    expect(ControlComponent).toBeCalled();
    expect(container).toMatchSnapshot();
  });
});
