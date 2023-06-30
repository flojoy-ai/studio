import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import { ControlProps } from "@src/feature/controls_panel/types/ControlProps";
import ControlGrid from "@src/feature/controls_panel/views/ControlGrid";

const controlProps: ControlProps = {
  isEditMode: true,
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
    const { container } = renderWithTheme(
      <ControlGrid controlProps={controlProps} />
    );
    expect(container).toMatchSnapshot();
  });
});
