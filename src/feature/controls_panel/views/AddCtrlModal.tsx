import { Fragment, useState } from "react";
import ReactModal from "react-modal";
import ModalCloseSvg from "../../../utils/ModalCloseSvg";
import {
  InputControlsManifest,
  OutputControlsManifest,
} from "../manifest/CONTROLS_MANIFEST";
import { modalStyles } from "../style/ControlModalStyles"

const AddCtrlModal = ({
  isOpen,
  afterOpenModal,
  closeModal,
  addCtrl,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState("input");
  const activeBtnStyle = {
    height: "100%",
    borderBottom:
      theme === "dark"
        ? "2px solid rgb(153, 245, 255)"
        : "2px solid rgba(123, 97, 255, 1)",
  };
  
  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel="Choose a Ctrl..."
    >
      <button onClick={closeModal} className="close-modal">
        <ModalCloseSvg
          style={{
            height: 23,
            width: 23,
          }}
        />
      </button>
      <div
        className="flex tab-panel"
        style={{
          borderBottom:
            theme === "dark"
              ? "1px solid rgb(47, 46, 46)"
              : "1px solid rgba(217, 217, 217, 1)",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          className="btn-tab"
          onClick={() => setActiveTab("input")}
          style={{
            ...(activeTab === "input" && activeBtnStyle),
          }}
        >
          Inputs
        </button>
        <button
          className="btn-tab"
          onClick={() => setActiveTab("output")}
          style={{
            ...(activeTab === "output" && activeBtnStyle),
          }}
        >
          Outputs
        </button>
      </div>
      {activeTab === "input" && (
        <div
          className="flex"
          style={{
            gap: "16px",
            alignItems: "center",
            width: "fit-content",
            flexWrap: "wrap",
            paddingTop: "12px",
          }}
        >
          {InputControlsManifest.map((ctrl, ctrlIndex) => (
            <Fragment key={ctrlIndex}>
              <button
                className={theme === "dark" ? "cmd-btn-dark" : "cmd-btn"}
                onClick={() =>
                  addCtrl({
                    type: ctrl.type,
                    name: ctrl.name,
                    minWidth: ctrl.minWidth,
                    minHeight: ctrl.minHeight,
                  })
                }
              >
                {ctrl.name}
              </button>
            </Fragment>
          ))}
        </div>
      )}
      {activeTab === "output" && (
        <div
          className="flex"
          style={{
            gap: "16px",
            alignItems: "center",
            width: "fit-content",
            flexWrap: "wrap",
            paddingTop: "12px",
          }}
        >
          {OutputControlsManifest.map((ctrl, ctrlIndex) => (
            <Fragment key={ctrlIndex}>
              <button
                className={theme === "dark" ? "cmd-btn-dark" : "cmd-btn"}
                onClick={() =>
                  addCtrl({
                    type: ctrl.type,
                    name: ctrl.name,
                    minWidth: ctrl.minWidth,
                    minHeight: ctrl.minHeight,
                  })
                }
              >
                {ctrl.name}
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </ReactModal>
  );
};

export default AddCtrlModal;
