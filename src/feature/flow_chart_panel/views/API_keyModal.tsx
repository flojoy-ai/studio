import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import FamilyHistoryIconSvg from "@src/assets/family_history_icon";
import React, { useEffect, useState } from "react";
import {
  Modal,
  createStyles,
  useMantineTheme,
  Button,
  Input,
} from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { PassThrough } from "stream";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "localhost";
const BACKEND_PORT = +process.env.VITE_BACKEND_PORT! || 8000;
const API_URL = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 43,
    height: "100%",
    width: "100%",
    padding: 24,
    backgroundColor: theme.colors.modal[0],
    borderRadius: 30
  },
  title: {
    display: "flex",
    gap: 5,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 10,
  },
  submitButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    color: 
      theme.colorScheme === "dark" ? "#99F5FF" :"#2E83FF",
  },
}));

const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { classes } = useStyles();
  const themeMantine = useMantineTheme();
  const { apiKey, setApiKey } = useFlowChartState();

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleClose = () => {
    setApiKey("");
    onClose();
  };

  const sendApiKeyToDjango = async (apiKey: string) => {
    try {
      const response = await fetch(`${API_URL}/api/set-api`, {
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

  const handleSendAPI = () => {
    if (apiKey == null || apiKey.trim() == "") {
      console.error("There is no API Key");
    } else {
      sendApiKeyToDjango(apiKey);
    }
  };

  return (
    <Modal
      data-testid="user_API_Key_modal"
      opened={isOpen}
      onClose={handleClose}
      aria-labelledby="API Key modal"
      size={600}
    >
      <div className={classes.container}>
        <div>
          <div className={classes.title}><FamilyHistoryIconSvg/>API Key:</div>
          
          <div className={classes.submitButton}>
            <Input type="text" onChange={handleApiKeyChange} value={apiKey} size="100"/>
            <Button disabled={!apiKey} onClick={handleSendAPI}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default APIKeyModal;
