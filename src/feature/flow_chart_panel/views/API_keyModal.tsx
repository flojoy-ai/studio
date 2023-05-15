import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { createStyles, useMantineTheme } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
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
  closeButton: {
    position: "absolute",
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
    top: 15,
    right: 10,
    padding: 0,
    color: theme.colors.accent1[0],
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 43,
    height: "100%",
    width: "100%",
    padding: 24,
    backgroundColor: theme.colors.modal[0],
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 10,
  },
}));

const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { classes } = useStyles();
  const themeMantine = useMantineTheme();
  const { apiKey, setApiKey } = useFlowChartState();

  const reactModalStyle: ReactModal.Styles = {
    content: {
      borderRadius: "8px",
      height: "85vh",
      width: "max(400px,936px)",
      position: "relative",
      inset: 0,
      padding: 0,
      backgroundColor: themeMantine.colors.modal[0],
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
      backgroundColor: themeMantine.colors.modal[0],
    },
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const sendApiKeyToDjango = async (apiKey: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/set-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: apiKey }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error("Request failed:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handelSendApi = () => {
    sendApiKeyToDjango(apiKey);
  };

  return (
    <ReactModal
      data-testid="user_API_Key_modal"
      isOpen={isOpen}
      onRequestClose={onClose}
      style={reactModalStyle}
      ariaHideApp={false}
      contentLabel={"API Key modal"}
    >
      <button onClick={onClose} className={classes.closeButton}>
        <ModalCloseSvg
          style={{
            height: 23,
            width: 23,
          }}
        />
      </button>

      <div className={classes.container}>
        <div className={classes.title}>
          <div>API Key</div>
          <input type="text" onChange={handleApiKeyChange} value={apiKey} />
          <button onClick={handelSendApi}>Submit</button>
        </div>
      </div>
    </ReactModal>
  );
};

export default APIKeyModal;
