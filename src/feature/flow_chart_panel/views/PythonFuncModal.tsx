import { Fragment, useState } from "react";
import ReactModal from "react-modal";
import ModalCloseSvg from "../../../utils/ModalCloseSvg";
import { COMMANDS, SECTIONS } from "../manifest/COMMANDS_MANIFEST";
import { PythonFuncModalProps } from "../types/PythonFuncModalProps";
import { FUNCTION_PARAMETERS } from "../manifest/PARAMETERS_MANIFEST";
import { PythonFuncModalStyles } from "../style/PythonModalStyle";

const PythonFuncModal = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  onAdd,
  theme,
}: PythonFuncModalProps) => {
  const [activeTab, setActiveTab] = useState(SECTIONS[0].title);

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
      style={PythonFuncModalStyles}
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
            onClick={() => setActiveTab(section.title)}
            key={section.title}
            style={{
              ...(activeTab === section.title && activeBtnStyle),
            }}
          >
            {section.title}
          </button>
        ))}
      </div>

      {SECTIONS.map((sections, index) => (
        <Fragment key={index}>
          {sections.title === activeTab &&
            sections.child.map((section) => (
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
