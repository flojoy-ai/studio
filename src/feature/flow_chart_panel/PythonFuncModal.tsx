import { Fragment, useState } from "react";
import ReactModal from "react-modal";
import ModalCloseSvg from "../../utils/ModalCloseSvg";
import { COMMANDS, SECTIONS } from "./COMMANDS_MANIFEST";
import type { NodeOnAddFunc } from "./ControlBar";
import { FUNCTION_PARAMETERS } from "./PARAMETERS_MANIFEST";
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
  onAdd: NodeOnAddFunc;
  theme: "light" | "dark";
}

const PythonFuncModal = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  onAdd,
  theme,
}: Props) => {
  const [activeTab, setActiveTab] = useState(SECTIONS[0][0].key);
  const activeBtnStyle = {
    height: "100%",
    borderBottom:
      theme === "dark"
        ? "2px solid rgb(153, 245, 255)"
        : "2px solid rgba(123, 97, 255, 1)",
  };
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
        {SECTIONS.map((section) => (
          <button
            className="btn-tab"
            onClick={() => setActiveTab(section[0].key)}
            key={section[0].key}
            style={{
              ...(activeTab === section[0].key && activeBtnStyle),
            }}
          >
            {section[0].name}
          </button>
        ))}
      </div>

      {SECTIONS.map((sections, index) => (
        <Fragment key={index}>
          {sections[0].key === activeTab &&
            sections.map((section) => (
              <Fragment key={section.key}>
                <div key={section.key}>
                  <p>{section.name}</p>
                  <div
                    className="flex"
                    style={{
                      gap: "8px",
                      alignItems: "center",
                      width: "fit-content",
                      flexWrap: "wrap",
                    }}
                  >
                    {COMMANDS.map((cmd, cmdIndex) => (
                      <Fragment key={cmdIndex}>
                        {section.key === cmd.type ? (
                          <button
                            className={
                              theme === "dark" ? "cmd-btn-dark" : "cmd-btn"
                            }
                            onClick={() => {
                              console.log(" cmd : ", cmd);
                              onAdd({
                                FUNCTION: cmd.key,
                                type: cmd.type,
                                params: FUNCTION_PARAMETERS[cmd.key],
                                inputs: cmd.inputs
                              });
                            }}
                            key={cmd.name}
                          >
                            {cmd.name}
                          </button>
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
        </Fragment>
      ))}
    </ReactModal>
  );
};

export default PythonFuncModal;
