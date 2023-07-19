import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo } from "react";
import { Modal, createStyles, Button, Input } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { sendApiKeyToDjango } from "@src/services/FlowChartServices";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
  container: {
    display: "relative",
    border: `1px solid ${theme.colors.accent5[0]}`,
    gap: 43,
    height: 230,
    backgroundColor: theme.colors.modal[1],
    borderRadius: 10,
    boxShadow:
      theme.colorScheme === "light"
        ? `0px 4px 8px 2px ${theme.colors.accent5[1]}`
        : "none",
  },

  title: {
    display: "flex",
    gap: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "7%",
    marginLeft: "5.6%",
    marginBottom: "-2%",
  },
  titleText: {
    marginTop: -2.3,
  },
  oneSubmitButtonLine: {
    display: "flex",
    marginLeft: "5.6%",
    marginTop: "4%",
    gap: 4,
    color: theme.colors.accent1[0],
  },
  inputDiv: {
    display: "relative",
    marginRight: 15,
  },
  lastLine: {
    display: "flex",
    marginLeft: "5.7%",
    marginTop: "3.5%",
  },
  submitBtn: {
    marginLeft: "56.2%",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0],
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[3]
          : theme.colors.accent2[2],
    },
  },
  listBtn: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0],
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[3]
          : theme.colors.accent2[2],
    },
  },
  closeBtn: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.title[0]
        : theme.colors.gray[9],
    top: 10,
    right: 15,
  },
  inputBox: {
    input: {
      width: 240,
      backgroundColor: theme.colors.modal[0],
    },
  },
}));
const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { apiKey, setApiKey, apiValue, setApiValue } = useFlowChartState();
  const { classes } = useStyles();

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiValue(e.target.value);
  };

  const handleClose = () => {
    setApiKey("");
    onClose();
  };

  const handleSendAPI = () => {
    notifications.show({
      id: "set-api-key",
      loading: true,
      title: `Setting your ${apiKey} key`,
      message: `Setting your ${apiKey} key, please be patient`,
      autoClose: false,
      withCloseButton: false,
    });
    sendApiKeyToDjango({ key: apiKey }, "set-cloud-api");
    setApiKey("");
  };

  return (
    <>
      <Modal.Root
        data-testid="user_API_Key_modal"
        opened={isOpen}
        onClose={handleClose}
        aria-labelledby="API Key modal"
        size={560}
        centered
      >
        <Modal.Overlay />
        <Modal.Content className={classes.container}>
          <Modal.CloseButton
            data-testid="api-key-close-btn"
            className={classes.closeBtn}
          />
          <div className={classes.title}>
            <FamilyHistoryIconSvg size={20} />
            <div className={classes.titleText}>Environment Variables</div>
          </div>
          <div className={classes.oneSubmitButtonLine}>
            <div className={classes.inputDiv}>
              <label htmlFor="key-input">Key:</label>
              <Input
                id="key-input"
                data-testid="api-key-input-key"
                type="text"
                placeholder="e.g. CLIENT_KEY"
                onChange={handleApiKeyChange}
                value={apiKey}
                className={classes.inputBox}
              />
            </div>
            <div className={classes.inputDiv}>
              <label htmlFor="value-input">Value:</label>
              <Input
                id="value-input"
                data-testid="api-key-input-value"
                type="text"
                onChange={handleApiValueChange}
                value={apiValue}
                className={classes.inputBox}
              />
            </div>
          </div>
          <div className={classes.lastLine}>
            <Button
              data-testid="cloud-input-btn"
              onClick={handleSendAPI}
              className={classes.listBtn}
            >
              List of Keys
            </Button>
            <Button
              data-testid="cloud-input-btn"
              disabled={!(apiKey && apiValue)}
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

export default memo(APIKeyModal);
