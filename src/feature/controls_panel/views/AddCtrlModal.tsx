import { CtlManifestType } from "@src/hooks/useFlowChartState";
import { Fragment, useState } from "react";
import ReactModal from "react-modal";
import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import {
  InputControlsManifest,
  OutputControlsManifest,
} from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { modalStyles } from "@src/feature/controls_panel/style/ControlModalStyles";
import { useMantineTheme } from "@mantine/styles";
import { Box } from "@mantine/core";

interface AddCtrlModalProps {
  isOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  addCtrl: (ctrlObj: Partial<CtlManifestType>) => void;
}

const AddCtrlModal = ({
  isOpen,
  afterOpenModal,
  closeModal,
  addCtrl,
}: AddCtrlModalProps) => {
  const theme = useMantineTheme();
  const accent =
    theme.colorScheme === "dark"
      ? theme.colors.accent1[0]
      : theme.colors.accent2[0];
  const [activeTab, setActiveTab] = useState("input");
  const activeBtnStyle = {
    height: "100%",
    borderBottom: `2px solid ${accent}`,
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={modalStyles(theme)}
      ariaHideApp={false}
      contentLabel="Choose a Ctrl..."
    >
      <button
        onClick={closeModal}
        data-testid={"add-ctrl-modal-close"}
        className="close-modal"
      >
        <ModalCloseSvg
          style={{
            height: 23,
            width: 23,
          }}
        />
      </button>
      <Box
        className="flex tab-panel"
        style={{
          borderBottom:
            theme.colorScheme === "dark"
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
      </Box>
      {activeTab === "input" && (
        <Box
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
                className={`cmd-btn ${theme}`}
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
        </Box>
      )}
      {activeTab === "output" && (
        <Box
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
                className={`cmd-btn ${theme}`}
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
        </Box>
      )}
    </ReactModal>
  );
};

export default AddCtrlModal;
