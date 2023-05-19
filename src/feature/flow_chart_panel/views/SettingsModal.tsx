import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import ReactModal from "react-modal";

const reactModalStyle: ReactModal.Styles = {
  content: {
    borderRadius: "8px",
    height: "85vh",
    width: "max(400px,936px)",
    position: "relative",
    inset: 0,
    padding: 0,
  },
  overlay: {
    zIndex: 100,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export const SettingsModal = ({ isOpen, onClose, theme }) => {
  return (
    <ReactModal
      data-testid="settings-modal"
      isOpen={isOpen}
      style={reactModalStyle}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel={"settings modal"}
    >
      <button onClick={onClose} className="closeBtn">
        <ModalCloseSvg
          style={{
            height: 23,
            width: 23,
          }}
        />
      </button>
    </ReactModal>
  );
};
