import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import React from "react";
import ReactModal from "react-modal";
import "./keyboardShortcutModal.css";
interface KeyboardShortcutProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light";
}

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
const KeyboardShortcutModal: React.FC<KeyboardShortcutProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  return (
    <ReactModal
      data-testid="keyboard_shortcut_modal"
      isOpen={isOpen}
      onRequestClose={onClose}
      style={reactModalStyle}
      ariaHideApp={false}
      contentLabel={"keyboard shortcut modal"}
    >
      <button onClick={onClose} className="kbs__close__btn">
        <ModalCloseSvg
          style={{
            height: 23,
            width: 23,
          }}
        />
      </button>
      <div className={`kbs__container ${theme}`}>
        {platforms.map((platform) => {
          return (
            <div className={`kbs__col ${theme}`} key={platform.key}>
              <div className="kbs__title">
                For{" "}
                <span className="kbs__platform__name">{platform.title}</span>
              </div>

              <div className={`kbs__list ${theme}`}>
                {keyboardShortcuts.map((shortcut) => (
                  <div
                    className={`kbs__list__item ${theme}`}
                    key={shortcut.command}
                  >
                    <span>{shortcut.command}</span>
                    <span className="kbs__cmd__key">
                      {shortcut.platforms[platform.key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ReactModal>
  );
};

export default KeyboardShortcutModal;

const platforms = [
  { title: "Windows", key: "windows" },
  { title: "MacOs", key: "macOs" },
];

const keyboardShortcuts = [
  {
    command: "Show/hide UI",
    platforms: {
      windows: "Ctrl \\",
      macOs: "⌘ z",
    },
  },
  {
    command: "Play",
    platforms: {
      windows: "Ctrl P",
      macOs: "⌘ P",
    },
  },
  {
    command: "Open Side Bar Panel",
    platforms: {
      windows: "Ctrl T",
      macOs: "⌘ T",
    },
  },
  {
    command: "Fit View",
    platforms: {
      windows: "Ctrl 1",
      macOs: "⌘ 1",
    },
  },
  {
    command: "Zoom In",
    platforms: {
      windows: "Ctrl +",
      macOs: "⌘ +",
    },
  },
  {
    command: "Zoom Out",
    platforms: {
      windows: "Ctrl -",
      macOs: "⌘ -",
    },
  },
  {
    command: "Layout Node",
    platforms: {
      windows: "Ctrl L",
      macOs: "⌘ L",
    },
  },
  {
    command: "Select All",
    platforms: {
      windows: "Ctrl A",
      macOs: "⌘ A",
    },
  },
  {
    command: "Deselect",
    platforms: {
      windows: "Alt C",
      macOs: "Option C",
    },
  },
  {
    command: "Close Node",
    platforms: {
      windows: "Ctrl W",
      macOs: "⌘ W",
    },
  },
  {
    command: "File Name",
    platforms: {
      windows: "Ctrl R",
      macOs: "⌘ R",
    },
  },
  {
    command: "Save",
    platforms: {
      windows: "Ctrl S",
      macOs: "⌘ S",
    },
  },
  {
    command: "Delete",
    platforms: {
      windows: "Ctrl D",
      macOs: "⌘ D",
    },
  },
];
