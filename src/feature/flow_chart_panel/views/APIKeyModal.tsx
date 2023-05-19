import { ChangeEvent } from "react";
import { Modal, createStyles, Button, Input } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { sendApiKeyToDjango } from "@src/services/FlowChartServices";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 10,
  },
  submitButton: {
    display: "flex",
    gap: 5,
  },
}));

const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { classes } = useStyles();
  const { apiKey, setApiKey } = useFlowChartState();

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleClose = () => {
    setApiKey("");
    onClose();
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
    >
      <div className={classes.container}>
        <div className={classes.title}>
          <div>API Key:</div>
          <div className={classes.submitButton}>
            <Input type="text" onChange={handleApiKeyChange} value={apiKey} />
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
