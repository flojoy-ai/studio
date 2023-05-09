import { renderWithTheme } from "@src/__tests__/__utils__/utils";
import {
  InputControlsManifest,
  OutputControlsManifest,
} from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";
import AddCtrlModal from "@src/feature/controls_panel/views/AddCtrlModal";
import { fireEvent } from "@testing-library/react";

describe("AddCtrlModal.tsx", () => {
  const props = {
    isOpen: true,
    afterOpenModal: jest.fn(),
    closeModal: jest.fn(),
    addCtrl: jest.fn(),
  };
  it("render AddCtrlModal correctly.", () => {
    const { container } = renderWithTheme(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("should fire closeModal function on clicking close button.", () => {
    const { getByTestId } = renderWithTheme(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
      />
    );
    fireEvent.click(getByTestId("add-ctrl-modal-close"));
    expect(props.closeModal).toBeCalledTimes(1);
  });
  it("render all input ctrls in modal by default.", () => {
    const { getByText } = renderWithTheme(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
      />
    );
    InputControlsManifest.forEach((ctrl) => {
      expect(getByText(ctrl.name)).toBeInTheDocument();
    });
  });
  it("should switch to outputs tab on clicking `outputs` button.", () => {
    const { getByText } = renderWithTheme(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
      />
    );
    fireEvent.click(getByText("Outputs"));
    OutputControlsManifest.forEach((ctrl) => {
      expect(getByText(ctrl.name)).toBeInTheDocument();
    });
  });
});
