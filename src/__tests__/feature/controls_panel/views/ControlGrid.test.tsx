import { render } from "@testing-library/react";
import ControlGrid from "@src/feature/controls_panel/views/ControlGrid";
import { ControlProps } from "@src/feature/controls_panel/types/ControlProps";

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
// mock `useFlowChartState` hook
jest.mock("@src/hooks/useFlowChartState");
// mock `Control` component
jest.mock("@src/feature/controls_panel/views/Control", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="control"></div>),
}));

describe("ControlGrid.tsx", () => {
  it("renders the ControlGrid component.", () => {
    const { container } = render(<ControlGrid controlProps={controlProps} />);
    expect(container).toMatchSnapshot();
  });
});
