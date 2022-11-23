import ReactModal from "react-modal";
import ModalCloseSvg from "../utils/ModalCloseSvg";

const modalStyles: ReactModal.Styles = {
  overlay: { zIndex: 99 },
  content: {
    border: "1px solid rgba(41, 41, 41, 1)",
    borderRadius: "8px",
    zIndex: 100,
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
};

interface Props {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  data: string[];
  theme: "light" | "dark";
}

const NodeErrorShow = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  theme,
  data,
}: Props) => {
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel="Choose a Python function"
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
        style={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {data.map((el) => (
          <p key={el}>{el}</p>
        ))}
      </div>
    </ReactModal>
  );
};

export default NodeErrorShow;
