import { fireEvent, render } from "@testing-library/react";
import AddCtrlModal from "@src/feature/controls_panel/views/AddCtrlModal";
import {
  InputControlsManifest,
  OutputControlsManifest,
} from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

describe("AddCtrlModal.tsx", () => {
  const props = {
    isOpen: true,
    afterOpenModal: jest.fn(),
    closeModal: jest.fn(),
    addCtrl: jest.fn(),
  };
  it("render AddCtrlModal correctly.", () => {
    const { container } = render(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
        theme={"dark"}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("should fire closeModal function on clicking close button.", () => {
    const { getByTestId } = render(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
        theme={"dark"}
      />
    );
    fireEvent.click(getByTestId("add-ctrl-modal-close"));
    expect(props.closeModal).toBeCalledTimes(1);
  });
  it("render all input ctrls in modal by default.", () => {
    const { getByText } = render(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
        theme={"dark"}
      />
    );
    InputControlsManifest.forEach((ctrl) => {
      expect(getByText(ctrl.name)).toBeInTheDocument();
    });
  });
  it("should switch to outputs tab on clicking `outputs` button.", () => {
    const { getByText } = render(
      <AddCtrlModal
        isOpen={props.isOpen}
        afterOpenModal={props.afterOpenModal}
        addCtrl={props.addCtrl}
        closeModal={props.closeModal}
        theme={"dark"}
      />
    );
    fireEvent.click(getByText("Outputs"));
    OutputControlsManifest.forEach((ctrl) => {
      expect(getByText(ctrl.name)).toBeInTheDocument();
    });
  });
});
