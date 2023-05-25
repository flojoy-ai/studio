import FamilyHistoryIconSvg from "@src/assets/family_history_icon";
import React, { useState } from "react";
import { Modal, createStyles, Button, Input } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconCheck } from "@tabler/icons-react";
interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "localhost";
const BACKEND_PORT = +process.env.VITE_BACKEND_PORT! || 8000;
const API_URL = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;
const useStyles = createStyles((theme) => ({
  container: {
    display: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 43,
    height: 200,
    width: "100%",
    backgroundColor: theme.colors.modal[1],
    borderRadius: 17,
  },
  title: {
    display: "flex",
    gap: 5,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "10%",
    marginLeft: "22%",
  },
  submitButtonLine: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    color: theme.colors.accent1[0],
  },
  submitBtn: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.accent1[0] : "none",
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  inputBox: {
    input: {
      width: 250,
      backgroundColor: theme.colors.modal[0],
    },
  },
}));
const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { classes } = useStyles();
  const { apiKey, setApiKey } = useFlowChartState();
  const [apiResponse, setApiResponse] = useState({
    success: false,
    data: null,
  });
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
        notifications.show({
          title: "Successful!",
          message: "Successfully set the API Key",
          icon: <IconCheck />,
          autoClose: 5000,
        });
        setApiResponse(responseData);
      } else {
        console.error("Request failed:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleSendAPI = () => {
    if (apiKey === null || apiKey.trim() === "") {
      console.error("There is no API Key");
    } else {
      sendApiKeyToDjango(apiKey);
    }
  };
  return (
    <>
      <Modal.Root
        data-testid="user_API_Key_modal"
        opened={isOpen}
        onClose={handleClose}
        aria-labelledby="API Key modal"
        size={600}
        centered
      >
        <Modal.Overlay />
        <Modal.Content className={classes.container}>
          <div className={classes.title}>
            <FamilyHistoryIconSvg size={20} />
            API Key:
          </div>
          <Modal.CloseButton className={classes.closeBtn} />
          <div className={classes.submitButtonLine}>
            <Input
              type="text"
              onChange={handleApiKeyChange}
              value={apiKey}
              className={classes.inputBox}
              placeholder="API Key"
            />
            <Button
              disabled={!apiKey}
              onClick={handleSendAPI}
              className={classes.submitBtn}
            >
              Submit
            </Button>
          </div>
        </Modal.Content>
      </Modal.Root>
      <Notifications />
    </>
  );
};
export default APIKeyModal;
